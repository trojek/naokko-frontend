import {Measurement} from "../types";
import {FunctionComponent, ReactNode, RefObject, useContext} from "react";
import {TableCell, TableHead, TableRow} from "@mui/material";
import {MeasurementContext} from "../MeasurementContext";

interface MeasurementRowProps {
  measurement: Measurement,
  label: string,
  ref?: RefObject<HTMLTableRowElement>
}

function measurementToString(x?: number): string {
  return !!x ? x.toFixed(2) : '-';
}

interface MeasurementCellProps {
  isError: boolean
  children: ReactNode
}

export const MeasurementCell = ({isError, children}: MeasurementCellProps) => {
  return (
    <TableCell
      align="center"
      sx={{
        color: isError ? "#b6171e" : "white",
        fontWeight: isError ? "bold" : ""
      }}
    >
      {children}
    </TableCell>
  )
}

export const MeasurementRow: FunctionComponent<MeasurementRowProps> = ({measurement, label, ref}) => {
  const context = useContext(MeasurementContext)

  const isError = context.measurement.measured && !measurement.isOK

  return (
    <TableRow ref={ref} sx={{height: 'unset'}}>
      <TableCell>{label}</TableCell>
      <MeasurementCell isError={isError}>
        {measurementToString(measurement.norm)}
      </MeasurementCell>
      <MeasurementCell isError={isError}>
        {measurementToString(measurement.real)}
      </MeasurementCell>
      <MeasurementCell isError={isError}>
        {measurementToString(measurement.error)}
      </MeasurementCell>
      <TableCell align="center">{measurementToString(measurement.tolerancePositive)}</TableCell>
      <TableCell align="center">{measurementToString(measurement.toleranceNegative)}</TableCell>
    </TableRow>
  )
}

export const MeasurementTableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell/>
        <TableCell align="center" sx={{color: "white"}}>NOM.</TableCell>
        <TableCell align="center" sx={{color: "white"}}>REAL.</TableCell>
        <TableCell align="center" sx={{color: "white"}}>BŁĄD</TableCell>
        <TableCell align="center" sx={{color: "white"}}>-TOL.</TableCell>
        <TableCell align="center" sx={{color: "white"}}>+TOL.</TableCell>
      </TableRow>
    </TableHead>
  )
}
