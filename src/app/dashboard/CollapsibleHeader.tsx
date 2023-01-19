import {FC, MouseEvent, ReactNode, useContext, useEffect, useState} from "react";
import {MeasurementContext} from "../MeasurementContext";
import {Box, Collapse, IconButton, Stack, Table, Typography} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface CollapsibleHeaderProps {
  title: string
  children: ReactNode
  forceOpen: boolean
  isOk: boolean
  handleSelection?: () => void
}

export const CollapsibleHeader: FC<CollapsibleHeaderProps> = ({title, children, forceOpen, handleSelection, isOk}) => {
  const {measurement: {measured}} = useContext(MeasurementContext)
  const [open, setOpen] = useState(false);

  const handleOpen = (e: MouseEvent) => {
    if (e.detail === 1) {
      setOpen(state => !state)
      if (handleSelection) handleSelection()
    }
  }

  useEffect(() => {
    setOpen(forceOpen)
  }, [forceOpen, setOpen])

  return (
    <Stack gap={'4px'} bgcolor="background.default">
      <Stack direction={'row'} gap={'8px'} bgcolor="background.default" paddingLeft={"8px"} alignItems="center"
             onClick={handleOpen}>
        {measured ? isOk ? <CheckCircleIcon fontSize={"small"} color="success"/> :
          <CancelIcon fontSize={"small"} color="primary"/> : <CheckCircleIcon fontSize={"small"} color="success"/>}
        <Typography variant='h6' fontSize={"medium"}>{title}</Typography>
        <IconButton aria-label="expand row" size="small">
          {open ? <KeyboardArrowUpIcon fontSize={"small"}/> : <KeyboardArrowDownIcon fontSize={"small"}/>}
        </IconButton>
      </Stack>
      <Collapse sx={{paddingLeft: "5px"}} in={open}>
        <Box component="div" mt={"-12px"} mb={"8px"}>
          <Table>
            {children}
          </Table>
        </Box>
      </Collapse>
    </Stack>
  )
}
