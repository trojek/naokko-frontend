import { useMemo, useRef, useState } from "react"
import { Button, FilledInput, Input, List, ListItem, ListItemButton, ListItemText, ListSubheader, OutlinedInput, Stack } from "@mui/material"
import Summary from "../components/modelSummary"
import useModels from "../hooks/useModels"
import { ThreeDimensionalPreview } from "../components/modelPreview/ThreeDimensionalPreview"
import { theme } from "../CustomThemeProvider"
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'

function SelectModel({ onChange }: { onChange: (modelIndex: string | undefined) => void }) {
  const keyboardRef = useRef<any>()
  const { fetching, list, getModel } = useModels()
  const [selectedModelIndex, setSelectedModelIndex] = useState<string>(list[0].index)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  const filtered = useMemo(() => list.filter(_ => _.index.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm, list])

  const emitSelectedModelIndexId = () => {
    onChange(selectedModelIndex)
  }

  return fetching
    ? <div>loading</div>
    : <Stack height="100%" overflow="hidden">
      <Stack overflow="hidden" direction="row" height="100%" padding="20px" gap="20px">
        <Stack width="30%" maxHeight="100%" overflow="auto" border="1px solid" borderColor={theme.palette.background.paper}>
          <List subheader={<Stack direction="row">
            <OutlinedInput
            fullWidth 
            className={keyboardVisible ? 'Mui-focused' : ''} 
            value={searchTerm} 
            placeholder="WYSZUKAJ" 
            onChange={(e) => {
              setSearchTerm(e.target.value)
              keyboardRef?.current?.setInput(e.target.value)
            }} onFocus={() => setKeyboardVisible(true)} />
            <Button
              style={{ display: searchTerm ? 'block' : 'none', flexShrink: 0 }}
              variant={'outlined'}
              onClick={() => {
                setSearchTerm('')
                keyboardRef?.current?.setInput('')
              }}>Wyczyść</Button>
          </Stack>}>
            {filtered.map(_ =>
            (<ListItem key={_.index} disablePadding>
              <ListItemButton selected={selectedModelIndex === _.index} onClick={() => setSelectedModelIndex(_.index)}>
                <ListItemText primary={_.index}></ListItemText>
              </ListItemButton>
            </ListItem>)
            )}
          </List>
        </Stack>
        <Stack flexGrow="1" justifyContent="center" alignItems="center" gap="20px">
          {selectedModelIndex === undefined
            ? 'WYBIERZ MODEL'
            : <>
              <Stack flexShrink={1} width="100%">

                <Summary model={getModel(selectedModelIndex)} />
              </Stack>
              <Stack flexGrow={1} width="100%" overflow="hidden">
                <ThreeDimensionalPreview key={selectedModelIndex} model={getModel(selectedModelIndex)} />
              </Stack>
              <Button color="primary" variant="contained" size="large" onClick={emitSelectedModelIndexId}>
                Rozpocznij pomiar
              </Button>
            </>
          }
        </Stack>
      </Stack>

      <Stack display={keyboardVisible ? 'flex' : 'none'}>
        <Keyboard
          keyboardRef={r => (keyboardRef.current = r)}
          onChange={(value) => setSearchTerm(value)}
          theme="keyboard-theme"
          layout={{
            default: [
              '1 2 3 4 5 6 7 8 9 0',
              'Q W E R T Y U I O P',
              '- A S D F G H J K L',
              '_ Z X C V B N M {bksp} {clear}',
              '. {space} {hide}'
            ]
          }}
          display={{
            '{bksp}': 'COFNIJ',
            '{clear}': 'WYCZYŚĆ',
            '{space}': ' ',
            '{hide}': 'UKRYJ'
          }}
          onKeyPress={(button: string) => {
            if (button === '{hide}') {
              setKeyboardVisible(false)
            }
            if (button === '{clear}') {
              setSearchTerm('')
              keyboardRef?.current?.setInput('')
            }
          }}
        />
      </Stack>
    </Stack>
}

export default SelectModel
