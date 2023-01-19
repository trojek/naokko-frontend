import {Cut, Element, Opening} from "../types";
import {Box, Card, IconButton, Stack, Table, TableBody} from "@mui/material";
import {MeasurementRow, MeasurementTableHeader} from "../dashboard/MeasurementsTable";
import React, {FC} from "react";
import CloseIcon from '@mui/icons-material/Close';

interface MeasurementPopupProps {
    element: Element
    onClose: () => any
}

export const MeasurementPopupContent: FC<MeasurementPopupProps> = ({element, onClose}) => {
    return (
        <Stack alignItems={'end'}>
            <Box component={'div'}  position={'absolute'} top={'-40px'}>
                <IconButton onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            </Box>
            <Card sx={{p: '8px', mt: '8px', bgcolor: 'white'}}>
                <Table size='small' sx={{'th': {fontWeight: 500}}}>
                    <MeasurementTableHeader/>
                    {element instanceof Cut
                        ? CutMeasurementTable(element as Cut)
                        : OpeningMeasurementTable(element as Opening)
                    }
                </Table>
            </Card>
        </Stack>
    )
}

const CutMeasurementTable = (cut: Cut) => {
    return (
        <TableBody>
            {!!cut.x1 && <MeasurementRow measurement={cut.x1} label="X1"/>}
            {!!cut.x2 && <MeasurementRow measurement={cut.x2} label="X2"/>}
            {!!cut.y1 && <MeasurementRow measurement={cut.y1} label="Y1"/>}
            {!!cut.y2 && <MeasurementRow measurement={cut.y2} label="Y2"/>}
            {!!cut.z1 && <MeasurementRow measurement={cut.z1} label="Z1"/>}
            {!!cut.z2 && <MeasurementRow measurement={cut.z2} label="Z2"/>}
            <MeasurementRow measurement={cut.depth} label="depth"/>
        </TableBody>
    );
}

const OpeningMeasurementTable = (opening: Opening) => {
    return (
        <TableBody>
            <MeasurementRow measurement={opening.x} label="X"/>
            <MeasurementRow measurement={opening.y} label="Y"/>
            <MeasurementRow measurement={opening.z} label="Z"/>
            <MeasurementRow measurement={opening.r} label="R"/>
            <MeasurementRow measurement={opening.depth} label="depth"/>
        </TableBody>
    )
}
