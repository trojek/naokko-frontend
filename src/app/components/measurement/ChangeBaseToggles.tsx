import { Switch, Stack } from "@mui/material";
import { useState } from "react";
import { bases } from '../../constans'

function ChangeBase({ baseIndex, onChange }: { baseIndex: number, onChange: (number: number) => void }) {
  const [base, setBase] = useState(baseIndex)
  const update = (pos: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBase = JSON.parse(JSON.stringify(bases[base]))
    newBase[pos] = newBase[pos] === 1 ? 0 : 1
    const index = bases.findIndex(_ => JSON.stringify(_) === JSON.stringify(newBase))
    setBase(index)
    onChange(index)
  }
  return <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} padding={'5px 15px 5px 5px'}>
    <Switch
      checked={!!bases[base][0]}
      onChange={update(0)}
    />
    X:{bases[base][0]}
    <div style={{flexGrow: 1}}></div>
    <Switch
      checked={!!bases[base][1]}
      onChange={update(1)}
    />
    Y:{bases[base][1]}
    <div style={{flexGrow: 1}}></div>
    <Switch
      checked={!!bases[base][2]}
      onChange={update(2)}
    />
    Z:{bases[base][2]}
  </Stack>
}

export default ChangeBase