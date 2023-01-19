import {FunctionComponent, useContext} from "react";
import {Paper, TableBody} from "@mui/material";
import {MeasurementRow, MeasurementTableHeader} from "./MeasurementsTable";
import {MeasurementContext} from "../MeasurementContext";
import { CollapsibleHeader } from "./CollapsibleHeader";

export const DimensionsTable: FunctionComponent = () => {
    const {measurement, setSelectedElement} = useContext(MeasurementContext)
    const size = measurement.model.size

    return (
        <Paper elevation={0}>
            <CollapsibleHeader title={`GABARYT 1`} forceOpen={true} isOk={size.isOk} handleSelection={() => setSelectedElement("size")}>
                <MeasurementTableHeader/>
                <TableBody>
                    <MeasurementRow measurement={size.x} label="X"/>
                    <MeasurementRow measurement={size.y} label="Y"/>
                    <MeasurementRow measurement={size.z} label="Z"/>
                </TableBody>
            </CollapsibleHeader>
        </Paper>
    )
}
