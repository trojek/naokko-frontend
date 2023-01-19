import { useState } from "react"
import { Button, List, ListItem, ListItemButton, ListItemText, ListSubheader, Stack } from "@mui/material"
import Summary from "../components/summary"
import useModels from "../hooks/useModels"
import { ThreeDimensionalPreview } from "../components/modelPreview/ThreeDimensionalPreview"

function SelectModel({onChange} : {onChange: (modelId: string | undefined) => void}) {
  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined)
  const { fetching, list, getModel } = useModels()
  const toggleSelected = (id: string | undefined) => {
    if (id === selectedModel) {
      setSelectedModel(undefined)
    } else {
      setSelectedModel(id)
    }
  }
  const emitSelectedModelId = () => {
    onChange(selectedModel)
  }

  return fetching
    ? <div>loading</div>
    : <Stack direction="row" height="100%" padding="20px" gap="20px">
      <Stack width="30%" maxHeight="100%" overflow="auto">
        <List subheader={<ListSubheader>Modele</ListSubheader>}>
          {list.map(_ =>
          (<ListItem key={_.id} disablePadding>
            <ListItemButton selected={selectedModel === _.id} onClick={() => toggleSelected(_.id)}>
              <ListItemText primary={_.id}></ListItemText>
            </ListItemButton>
          </ListItem>)
          )}
        </List>
      </Stack>
      <Stack flexGrow="1" justifyContent="center" alignItems="center" gap="20px">
        {selectedModel === undefined
          ? 'Wybierz model'
          : <>
              <Stack flexShrink={1} width="100%">

              <Summary model={getModel(selectedModel)}/>
              </Stack>
              <Stack flexGrow={1} width="100%">
                <ThreeDimensionalPreview key={selectedModel} model={getModel(selectedModel)}/>
              </Stack>
            </>
        }
        <Button size="large" onClick={emitSelectedModelId}>
          Rozpocznij pomiar
        </Button>
      </Stack>
    </Stack>
}

export default SelectModel
