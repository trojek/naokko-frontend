import { useState } from "react"
import { CustomThemeProvider } from "./CustomThemeProvider"
import SelectModel from "./views/SelectModel"
import Measurement from "./views/Measurement"

function App() {
    const [selectedModelIndex, setSelectedModelIndex] = useState<undefined | string>(undefined)
    return (
        <CustomThemeProvider>
            { selectedModelIndex === undefined
                ? <SelectModel onChange={setSelectedModelIndex}></SelectModel>
                : <Measurement modelIndex={selectedModelIndex} clear={() => setSelectedModelIndex(undefined)}></Measurement>
            }
        </CustomThemeProvider>
    )
}

export default App
