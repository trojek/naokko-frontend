import { Button, CircularProgress, Stack } from "@mui/material"
import { useEffect } from "react"
import MeasurementSummary from "../components/measurement/MeasurementSummary"
import Summary from "../components/summary"
import useMeasurement from "../hooks/useMeasurement"
import useModels from "../hooks/useModels"
import { Model } from "../types"

function Preview({ modelId, clear } : { modelId: string, clear: () => void }) {
  const { getModelWrapper } = useModels()
  const { id, json } = getModelWrapper(modelId)
  const {
    measurementState,
    measuredModel,
    startMeasurement,
    continueMeasurement,
    finishMeasurement
  } = useMeasurement(json)
  
  useEffect(() => {
    console.log(measurementState)
  }, [measurementState])
  

  // console.log(json)
  return <Stack height="100%" justifyContent="center" alignItems="center">
    {['started', 'continuing', 'finishing'].includes(measurementState) && <>
      <CircularProgress />
      {measurementState === 'started'
        ? 'Pomiar 1'
        : measurementState === 'continuing'
          ? 'Pomiar 2'
          : 'Zakańczanie'
      }
    </>}
    {measurementState === 'idle' && <>
      <Button onClick={startMeasurement}>Rozpocznij pomiar</Button>
    </>}
    {measurementState === 'awaiting' && <>
      Kontynuować drugi pomiar?
      <Button onClick={continueMeasurement}>Kontynuuj</Button>
      <Button onClick={finishMeasurement}>Zakończ</Button>
    </>}
    {measurementState === 'finished' && <div style={{height: '100%', width: '100%', position: 'relative'}}>
      <MeasurementSummary model={measuredModel as Model} />
      <Button onClick={clear} style={{position: 'absolute', left: 0, top: 0}}>Indeks</Button>
    </div>}
  </Stack>
}

export default Preview
