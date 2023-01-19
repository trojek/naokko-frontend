import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Model } from '../../types'
function Summary({ model }: { model: Model }) {
  const size = model.size

  return (
    <>
      <Typography variant={"h4"} gutterBottom>{model.index}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="20%">X</TableCell>
              <TableCell width="20%">Y</TableCell>
              <TableCell width="20%">Z</TableCell>
              <TableCell width="20%">Otwory</TableCell>
              <TableCell width="20%">Wcięcia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell width="20%">{size.x.norm} mm</TableCell>
              <TableCell width="20%">{size.y.norm} mm</TableCell>
              <TableCell width="20%">{size.z.norm} mm</TableCell>
              <TableCell width="20%">{model.openingCount()}</TableCell>
              <TableCell width="20%">{model.cutsCount()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Summary
