import {Backdrop, Box, CircularProgress, Typography} from "@mui/material";
import React, {FunctionComponent, useEffect, useState} from "react";

interface LoadingDialogProps {
    open: boolean
}

export const LoadingDialog: FunctionComponent<LoadingDialogProps> = ({open}) => {
    const [delayedOpen, setDelayedOpen] = useState(false)

    useEffect(() => {
        if (open) {
            const timeout = setTimeout(() => setDelayedOpen(true));
            return () => clearTimeout(timeout)
        } else {
            setDelayedOpen(false)
        }
    }, [open])

    return (
        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={open}>
            {delayedOpen &&
                <Box component="div" sx={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center'}}>
                    <CircularProgress color='inherit'/>
                    <Typography color='inherit'>Ładowanie modelu...</Typography>
                </Box>
            }
        </Backdrop>
    )
}
