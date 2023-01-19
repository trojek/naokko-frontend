import { useState } from "react"
import { Button, List, ListItem, ListItemButton, ListItemText, ListSubheader, Stack } from "@mui/material"
import Summary from "../components/modelSummary"
import useModels from "../hooks/useModels"
import { ThreeDimensionalPreview } from "../components/modelPreview/ThreeDimensionalPreview"
import { theme } from "../CustomThemeProvider"

function SelectModel({onChange} : {onChange: (modelIndex: string | undefined) => void}) {
  const { fetching, list, getModel } = useModels()
  const [selectedModelIndex, setSelectedModelIndex] = useState<string>(list[0].index)
  
  const emitSelectedModelIndexId = () => {
    onChange(selectedModelIndex)
  }

  return fetching
    ? <div>loading</div>
    : <Stack direction="row" height="100%" padding="20px" gap="20px">
      <Stack width="30%" maxHeight="100%" overflow="auto" border="1px solid" borderColor={theme.palette.background.paper}>
        <List subheader={<ListSubheader>MODELE</ListSubheader>}>
          {list.map(_ =>
          (<ListItem key={_.index} disablePadding>
            <ListItemButton selected={selectedModelIndex === _.index} onClick={() => setSelectedModelIndex(_.index)}>
              <ListItemText primary={_.index}></ListItemText>
            </ListItemButton>
          </ListItem>)
          )}
        </List>
      </Stack>
      <Stack flexGrow="1" justifyContent="center" alignItems="center" gap="20px">
        {selectedModelIndex === undefined
          ? 'WYBIERZ MODEL'
          : <>
              <Stack flexShrink={1} width="100%">

              <Summary model={getModel(selectedModelIndex)}/>
              </Stack>
              <Stack flexGrow={1} width="100%">
                <ThreeDimensionalPreview key={selectedModelIndex} model={getModel(selectedModelIndex)}/>
              </Stack>
              <Button color="primary" variant="contained" size="large" onClick={emitSelectedModelIndexId}>
                Rozpocznij pomiar
              </Button>
            </>
        }
      </Stack>
    </Stack>
}

export default SelectModel
