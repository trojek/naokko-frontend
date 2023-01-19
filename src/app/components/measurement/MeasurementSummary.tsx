import { List, ListItem, ListItemButton, ListItemText, ListSubheader, Stack } from "@mui/material"
import { theme } from "../../CustomThemeProvider"
import { Model } from "../../types"
import { useMultiSelectable } from "../../useSelectable"
import { ThreeDimensionalPreview } from "../modelPreview/ThreeDimensionalPreview"

function MeasurementSummary({ model }: { model: Model }) {
  const { selected, isSelected, toggleSelected } = useMultiSelectable({ key: 'id' })

  // console.log(model)
  return model ? (
    <Stack direction="row" height="100%" padding="20px" gap="20px">
      <Stack flexGrow={1}>
        <ThreeDimensionalPreview {...{ model, selected, isSelected, toggleSelected }} />
      </Stack>
      <Stack width="30%" flexShrink={0} maxHeight="100%" overflow="auto" border="1px solid" borderColor={theme.palette.background.paper}>
        <List subheader={<ListSubheader>{ model.index }</ListSubheader>}>

        </List>
      </Stack>
    </Stack>
  ) : (<></>)
}

export default MeasurementSummary
