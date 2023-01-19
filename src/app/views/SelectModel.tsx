import { useState } from "react"
import { Button, List, ListItem, ListItemButton, ListItemText, ListSubheader, Stack } from "@mui/material"
import Summary from "../components/summary"
import useModels from "../hooks/useModels"
import { ThreeDimensionalPreview } from "../components/modelPreview/ThreeDimensionalPreview"

function SelectModel({onChange} : {onChange: (modelIndex: string | undefined) => void}) {
  const [selectedModelIndex, setSelectedModelIndex] = useState<string | undefined>(undefined)
  const { fetching, list, getModel } = useModels()
  
  const toggleSelected = (index: string | undefined) => {
    if (index === selectedModelIndex) {
      setSelectedModelIndex(undefined)
    } else {
      setSelectedModelIndex(index)
    }
  }
  const emitSelectedModelIndexId = () => {
    onChange(selectedModelIndex)
  }

  return fetching
    ? <div>loading</div>
    : <Stack direction="row" height="100%" padding="20px" gap="20px">
      <Stack width="30%" maxHeight="100%" overflow="auto">
        <List subheader={<ListSubheader>Modele</ListSubheader>}>
          {list.map(_ =>
          (<ListItem key={_.index} disablePadding>
            <ListItemButton selected={selectedModelIndex === _.index} onClick={() => toggleSelected(_.index)}>
              <ListItemText primary={_.index}></ListItemText>
            </ListItemButton>
          </ListItem>)
          )}
        </List>
      </Stack>
      <Stack flexGrow="1" justifyContent="center" alignItems="center" gap="20px">
        {selectedModelIndex === undefined
          ? 'Wybierz model'
          : <>
              <Stack flexShrink={1} width="100%">

              <Summary model={getModel(selectedModelIndex)}/>
              </Stack>
              <Stack flexGrow={1} width="100%">
                <ThreeDimensionalPreview key={selectedModelIndex} model={getModel(selectedModelIndex)}/>
              </Stack>
            </>
        }
        <Button size="large" onClick={emitSelectedModelIndexId}>
          Rozpocznij pomiar
        </Button>
      </Stack>
    </Stack>
}

export default SelectModel
