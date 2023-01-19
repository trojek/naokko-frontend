import { useState } from "react"
import { CustomThemeProvider } from "./CustomThemeProvider"
import SelectModel from "./views/SelectModel"
import Measurement from "./views/Measurement"

function App() {
    const [selectedModelId, setSelectedModelId] = useState<undefined | ModelWrapper['id']>(undefined)
    return (
        <CustomThemeProvider>
            { selectedModelId === undefined
                ? <SelectModel onChange={setSelectedModelId}></SelectModel>
                : <Measurement modelId={selectedModelId} clear={() => setSelectedModelId(undefined)}></Measurement>
            }
        </CustomThemeProvider>
    )
}

export default App
