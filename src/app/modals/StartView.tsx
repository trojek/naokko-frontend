import { FC, useContext } from "react";
import {AppContext} from "../AppContext";
import { Backdrop, Button, Stack, Typography, useTheme } from "@mui/material";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

interface StartViewProps {
    onSelection: () => any
}



export const StartView: FC<StartViewProps> = ({onSelection}) => {
    const theme = useTheme();
    const {setSelectedIndex} = useContext(AppContext)
    
    return (
        <Backdrop
            sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={true}
        >
            <Stack
                component={"div"}
                direction="row"
                alignItems="center"
                justifyContent="space-evenly"
                width="100vw"
                height="100vh"
                sx={{
                    background: theme.palette.background.paper,
                }}
            >
                <img src="/logo_large.svg" alt="Duże logo" width="500px" />
                <Stack gap="64px" alignItems="start">
                    <Button onClick={() => {
                                        setSelectedIndex("no_cad.stp")
                                       }}>
                        <Stack direction="row" alignItems="center" gap="48px">
                            <PsychologyAltIcon
                                sx={{
                                    fontSize: "110px",
                                    color: "#000000",
                                    backgroundColor: "primary.dark",
                                    borderRadius: theme.shape.borderRadius,
                                }}
                            />
                            <Typography
                                variant="h2"
                                color="text.primary"
                            >
                                POMIAR BEZ MODELU CAD
                            </Typography>
                        </Stack>
                    </Button>
                    <Button onClick={onSelection}>
                        <Stack direction="row" alignItems="center" gap="48px">
                            <QrCodeScannerOutlinedIcon
                                sx={{
                                    fontSize: "110px",
                                    color: "#000000",
                                    backgroundColor: "primary.dark",
                                    borderRadius: theme.shape.borderRadius,
                                }}
                            />
                            <Typography
                                variant="h2"
                                color="text.primary"
                            >
                                ZESKANUJ KOD QR
                            </Typography>
                        </Stack>
                    </Button>
                    <Button onClick={onSelection}>
                        <Stack direction="row" alignItems="center" gap="48px">
                            <ManageSearchOutlinedIcon
                                sx={{
                                    fontSize: "110px",
                                    color: "#000000",
                                    backgroundColor: "primary.dark",
                                    borderRadius: theme.shape.borderRadius,
                                }}
                            />
                            <Typography
                                variant="h2"
                                color="text.primary"
                            >
                                WYSZUKAJ INDEKS
                            </Typography>
                        </Stack>
                    </Button>
                </Stack>
            </Stack>
        </Backdrop>
    );
};
