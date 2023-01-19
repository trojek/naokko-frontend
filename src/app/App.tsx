import { useState } from "react"
import Preview from "./components/measurmentSummary"
import { CustomThemeProvider } from "./CustomThemeProvider"
import SelectModel from "./views/SelectModel"

function App() {
    const [selectedModelId, setSelectedModelId] = useState<undefined | ModelWrapper['id']>(undefined)
    return (
        <CustomThemeProvider>
            { selectedModelId === undefined
                ? <SelectModel onChange={setSelectedModelId}></SelectModel>
                : <Preview modelId={selectedModelId}></Preview>
            }
        </CustomThemeProvider>
    )
}

export default App
