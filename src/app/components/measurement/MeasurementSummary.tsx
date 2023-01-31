import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, IconButton, Stack, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { theme } from "../../CustomThemeProvider"
import { Model } from "../../types"
import { useMultiSelectable } from "../../useSelectable"
import { ThreeDimensionalPreview } from "../modelPreview/ThreeDimensionalPreview"
import { useMemo, useState } from "react"
import { directions, directionsNames, views } from '../../constans'
import ChangeBase from "./ChangeBase"

const ElementField = ({ element, name, width = '100%', type = 'norm' }: any) => {
  if (element && element[name]) {
    return <Stack sx={{ width }} direction="row" justifyContent="space-between">
      <span>
        {type === 'norm' ? name.toUpperCase() : type.toUpperCase().slice(0, 1)}
        {type.includes('Positive') ? '+' : ''}
        {type.includes('Negative') ? '-' : ''}
        :</span>
      <span>{element[name][type].toFixed(1)}</span>
    </Stack>
  }
  return <></>
}

const ElementPreview = ({ onClick, isSelected, name, fields, element }: any) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const onToggleExpand = (e: any) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }
  return <Stack
    onClick={onClick}
    direction="row"
    padding="15px"
    alignItems="flex-start"
    border="1px solid"
    borderColor={element.isOk ? 'transparent' : 'red'}
  >
    <Checkbox
      sx={{ padding: 0, marginRight: '20px' }}
      checked={isSelected}
      color="secondary"
    />
    <Typography sx={{ textTransform: 'uppercase', marginRight: '30px' }}>
      {name}
    </Typography>
    <Stack flexGrow={1}>
      {(isExpanded ? ['norm', 'real', 'error', 'tolerancePositive', 'toleranceNegative'] : ['norm']).map(type =>
        <Stack direction="row" gap="30px" sx={{ marginLeft: 'auto' }} flexGrow={1} width="100%">
          {fields.map((field: string) => <ElementField key={field} name={field} element={element} type={type} />)}
        </Stack>
      )}
    </Stack>
    <IconButton
      onClick={onToggleExpand}
      color="secondary"
      size="small"
      sx={{ margin: '-5px', marginLeft: '10px' }}>
      <ExpandMoreIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }} />
    </IconButton>
  </Stack>
}

function MeasurementSummary({ model, baseIndex, updateBaseIndex, print }: { model: Model, baseIndex: number, updateBaseIndex: (number: number) => void, print: (elements: string[]) => void }) {
  const [previewView, setPreviewView] = useState<typeof views[number]>('3d')
  const { selected, isSelected, toggleSelected, selectAll, deselectAll } = useMultiSelectable({ key: 'id' })
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange =
    (panel: typeof directions[number] | 'size') => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      if (directions.includes(panel as typeof directions[number])) {
        setPreviewView(panel as typeof directions[number])
      }
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
        <ThreeDimensionalPreview previewView={previewView} {...{ model, selected, isSelected, toggleSelected }} />
      </Stack>
      <Stack width="35%" flexShrink={0} maxHeight="100%">
        <Stack flexGrow={1} overflow="auto" border="1px solid" borderColor={theme.palette.background.paper}>
          <ChangeBase baseIndex={baseIndex} onChange={updateBaseIndex} />
          <Accordion disableGutters sx={{ background: 'transparent' }} expanded={expanded === 'size'} onChange={handleChange('size')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ display: 'flex', background: theme.palette.background.paper, position: 'sticky', top: 0, zIndex: 10 }}
            >
              <Typography sx={{ textTransform: 'uppercase' }}>
                Wielkość
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack
                direction="row" marginY="10px">
                <ElementField name="x" element={model.size} />
                <ElementField name="Y" element={model.size} />
                <ElementField name="Z" element={model.size} />
              </Stack>
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
                  sx={{ padding: '10px', margin: '-10px', marginRight: '10px' }}
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
              <AccordionDetails sx={{ padding: 0 }}>
                {model.getOpenings(direction).map((opening, idx) =>
                  <ElementPreview
                    key={idx}
                    onClick={() => toggleSelected(opening)}
                    isSelected={isSelected(opening)}
                    name={`O${idx + 1}`}
                    fields={['x', 'y', 'z', 'r']}
                    element={opening}
                  />
                )}
                {model.getCuts(direction).map((cut, idx) =>
                  <ElementPreview
                    key={idx}
                    onClick={() => toggleSelected(cut)}
                    isSelected={isSelected(cut)}
                    name={`W${idx + 1}`}
                    fields={['x1', 'x2', 'y1', 'y2', 'z1', 'z2']}
                    element={cut}
                  />
                )}
              </AccordionDetails>

            </Accordion>))}
        </Stack>
        <Button
          disabled={selected.length === 0}
          onClick={() => print(selected.map(({ id }: any) => id))}
        >
          Drukuj raport
        </Button>
      </Stack>
    </Stack>
  ) : (<></>)
}

export default MeasurementSummary
