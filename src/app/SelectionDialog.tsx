import {FunctionComponent, useContext, useEffect, useState} from "react";
import {
    Box,
    Button, CircularProgress,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle, InputAdornment,
    Stack, Table, TableBody, TableCell, TableRow,
    TextField,
} from "@mui/material";
import {useQuery} from "react-query";
import {AppContext} from "./AppContext";
import {useDebounce} from "use-debounce";

interface DialogProps {
    open: boolean;
    onClose: () => void;
}

const DialogWindow: FunctionComponent<DialogProps> = (props) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            fullWidth={true}
            maxWidth='md'
            fullScreen
        >
            <Stack justifyContent={"center"} height={"100%"} sx={{background:"black"}}>
                <DialogTitle>WYBIERZ ELEMENT</DialogTitle>
                <DialogContent>
                    {props.children}
                </DialogContent>
            </Stack>
        </Dialog>
    )
}
export const SelectionDialog: FunctionComponent<DialogProps> = ({open, onClose}) => {
    const maxLen = 5

    const [query, setQuery] = useState('')
    const [debouncedQuery] = useDebounce(query, 200)

    const {registerClient, setSelectedIndex, setCommunicationError} = useContext(AppContext)
    const {isLoading, isFetching, data} = useQuery(
        ['models', debouncedQuery],
        () => registerClient.getModels(debouncedQuery, maxLen),
        {onError: () => setCommunicationError()})

    const [debouncedLoading] = useDebounce(isLoading || isFetching, 200)

    useEffect(() => {
        setQuery('')
    }, [open])

    return (
        <DialogWindow open={open} onClose={onClose}>
            <DialogContentText>
                WYBIERZ Z KATALOGU ELEMENT KTÓRY CHCESZ ZMIERZYĆ
            </DialogContentText>

            <TextField
                value={query}
                onChange={e => setQuery(e.target.value)}
                margin="normal"
                id="element-index"
                label="SZUKAJ"
                fullWidth
                variant="outlined"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {debouncedLoading && <CircularProgress/>}
                        </InputAdornment>
                    ),
                }}
            />

            <Box component="div">
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableBody>
                        {!!data && data.map(d => (
                            <TableRow key={d.index}
                                      onClick={ () => {
                                        setSelectedIndex(d.index)
                                        onClose()
                                       }}>
                                <TableCell sx={{fontSize: "1.25rem", padding: "0 15px"}}>
                                    {d.index === "no_cad.stp" ? <b>{d.index}</b> : <span>{d.index}</span>}
                                </TableCell>
                                <TableCell align="right" sx={{padding: "5px"}}>
                                    <Button
                                        sx={{
                                            fontSize: "1.25rem",
                                        }}
                                    >
                                        WYBIERZ
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </DialogWindow>
    )
}
