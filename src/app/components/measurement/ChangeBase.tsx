import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { bases } from '../../constans'

function ChangeBase ({baseIndex, onChange} : {baseIndex: number, onChange: (number: number) => void}) {
  const [base, setBase] = useState(baseIndex)
  const update = (event: SelectChangeEvent) => {
    const index = event.target.value
    setBase(Number(index))
    onChange(Number(index))
  }
  return <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={String(base)}
    onChange={update}
  >
    {bases.map((base, index) => 
      <MenuItem key={index} value={String(index)}>{JSON.stringify(base)}</MenuItem>
    )}
  </Select>
}

export default ChangeBase