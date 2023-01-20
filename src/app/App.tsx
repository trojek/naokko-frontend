import { useState } from "react"
import { CustomThemeProvider } from "./CustomThemeProvider"
import SelectModel from "./views/SelectModel"
import Measurement from "./views/Measurement"
import { CircularProgress, Stack } from "@mui/material"
import useModels from "./hooks/useModels"

function App() {
    const { fetching } = useModels()
    const [selectedModelIndex, setSelectedModelIndex] = useState<undefined | string>(undefined)
    return (
        <CustomThemeProvider>
            {fetching
                ? <Stack height="100%" justifyContent="center" alignItems="center" gap="20px">
                    <CircularProgress />
                    Ładowanie modeli
                </Stack>
                : selectedModelIndex === undefined
                    ? <SelectModel onChange={setSelectedModelIndex}></SelectModel>
                    : <Measurement modelIndex={selectedModelIndex} clear={() => setSelectedModelIndex(undefined)}></Measurement>
            }
        </CustomThemeProvider>
    )
}

export default App
