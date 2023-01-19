import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
function Summary({ model }: { model: ModelWrapper }) {
  const size = model.json.size

  return (
    <>
      <Typography variant={"h4"} gutterBottom>{model.id}</Typography>
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
              <TableCell width="20%">{model.json.openingCount()}</TableCell>
              <TableCell width="20%">{model.json.cutsCount()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Summary
