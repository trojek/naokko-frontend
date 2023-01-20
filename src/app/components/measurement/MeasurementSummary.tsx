import { Accordion, AccordionDetails, AccordionSummary, Checkbox, List, ListItem, ListItemButton, ListItemText, ListSubheader, Stack, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { theme } from "../../CustomThemeProvider"
import { Model } from "../../types"
import { useMultiSelectable } from "../../useSelectable"
import { ThreeDimensionalPreview } from "../modelPreview/ThreeDimensionalPreview"
import { useMemo, useState } from "react"
import { directions, directionsNames } from '../../constans'

const ElementField = ({element, name} : any) => {
  if (element && element[name]) {
    return <span>{name.toUpperCase()}:{Math.round(element[name].norm)}</span>
  }
  return <></>
}

function MeasurementSummary({ model }: { model: Model }) {
  const { selected, isSelected, toggleSelected, selectAll, deselectAll } = useMultiSelectable({ key: 'id' })
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const togglePlaneAll = (direction: string) => (e: any) => {
    e.stopPropagation()
    const plane = (model as any)[direction]
    const elements = [...plane.openings, ...plane.cuts]
    if (e.target.checked) {
      selectAll(elements)
    } else {
      deselectAll(elements)
    }
  }

  type DirectionState = {
    areAllSelected: boolean | undefined
    allElements: number
    allSelected: number
    allOpenings: number
    allCuts: number
  }

  type DirectionsState = {
    front: DirectionState
    rear: DirectionState
    left: DirectionState
    right: DirectionState
    top: DirectionState
    bottom: DirectionState
  }

  const directionState: DirectionsState = useMemo(() => directions.reduce((acc, curr) => {
    const plane = (model as any)[curr]
    const elements = [...plane.openings, ...plane.cuts]
    const elementsKeys = elements.map(_ => _.id)
    const selectedKeys = selected.map((_: any) => _.id)
    const selectedElementKeys = elementsKeys.filter(_ => selectedKeys.includes(_))
    const areAllSelected = elementsKeys.length > 0 && elementsKeys.every(_ => selectedKeys.includes(_))
      ? true
      : elementsKeys.length > 0 && elementsKeys.every(_ => !selectedKeys.includes(_))
        ? false
        : undefined

      ; (acc as any)[curr] = {
        areAllSelected,
        allSelected: selectedElementKeys.length,
        allElements: elements.length,
        allCuts: plane.cuts.length,
        allOpenings: plane.openings.length
      }
    return acc
  }, {} as DirectionsState), [model, selected])

  return model ? (
    <Stack direction="row" height="100%" padding="20px" gap="20px">
      <Stack flexGrow={1}>
        <ThreeDimensionalPreview {...{ model, selected, isSelected, toggleSelected }} />
      </Stack>
      <Stack width="30%" flexShrink={0} maxHeight="100%" overflow="auto" border="1px solid" borderColor={theme.palette.background.paper}>
        <Accordion expanded={expanded === 'size'} onChange={handleChange('size')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ textTransform: 'uppercase' }}>
              Wielkość
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            Test
          </AccordionDetails>
        </Accordion>
        {directions.map((direction, idx) => (
          <Accordion
            key={idx}
            disabled={directionState[direction].allElements === 0}
            disableGutters
            sx={{ background: 'transparent' }}
            expanded={expanded === direction}
            onChange={handleChange(direction)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ display: 'flex', background: theme.palette.background.paper, position: 'sticky', top: 0, zIndex: 10 }}
            >
              <Checkbox
                sx={{ padding: 0, marginRight: '20px' }}
                onClick={togglePlaneAll(direction)}
                checked={!!directionState[direction].areAllSelected}
                indeterminate={directionState[direction].allElements !== 0 && directionState[direction].areAllSelected === undefined}
              />
              <Typography sx={{ textTransform: 'uppercase' }}>
                {directionsNames[idx]}
              </Typography>
              <Typography sx={{ marginLeft: 'auto' }}>
                {directionState[direction].allElements === 0
                  ? <>BRAK</>
                  : <>
                    {directionState[direction].allSelected}/{directionState[direction].allElements}
                  </>}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {model.getOpenings(direction).map((opening, idx) => <Stack 
                  onClick={() => toggleSelected(opening)} direction="row" marginY="5px">
                <Checkbox
                  sx={{ padding: 0, marginRight: '20px' }}
                  checked={isSelected(opening)}
                />
                <Typography sx={{ textTransform: 'uppercase' }}>
                  Otwór {idx + 1}
                </Typography>
                <Stack direction="row" gap="10px" sx={{ marginLeft: 'auto' }}>
                  <ElementField name="x" element={opening} />
                  <ElementField name="y" element={opening} />
                  <ElementField name="z" element={opening} />
                </Stack>
              </Stack>)}
              {model.getCuts(direction).map((cut, idx) => <Stack 
                  onClick={() => toggleSelected(cut)} direction="row" marginY="5px">
                <Checkbox
                  sx={{ padding: 0, marginRight: '20px' }}
                  checked={isSelected(cut)}
                />
                <Typography sx={{ textTransform: 'uppercase' }}>
                  Wręga {idx + 1}
                </Typography>
                <Stack direction="row" gap="10px" sx={{ marginLeft: 'auto' }}>
                  <ElementField name="x1" element={cut} />
                  <ElementField name="x2" element={cut} />
                  <ElementField name="y1" element={cut} />
                  <ElementField name="y2" element={cut} />
                  <ElementField name="z1" element={cut} />
                  <ElementField name="z2" element={cut} />
                </Stack>
              </Stack>)}
            </AccordionDetails>
          </Accordion>))}
        {/* </List> */}
      </Stack>
    </Stack>
  ) : (<></>)
}

export default MeasurementSummary
