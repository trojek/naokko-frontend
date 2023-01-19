import { Button, CircularProgress, Stack } from "@mui/material"
import { useEffect } from "react"
import MeasurementSummary from "../components/measurement/MeasurementSummary"
import useMeasurement from "../hooks/useMeasurement"
import useModels from "../hooks/useModels"
import { Model } from "../types"

function Measurement({ modelIndex, clear }: { modelIndex: string, clear: () => void }) {
  const { getModel } = useModels()
  const model = getModel(modelIndex)
  const {
    measurementState,
    measuredModel,
    continueMeasurement,
    finishMeasurement
  } = useMeasurement(model)

  useEffect(() => {
    console.log('measurement state:', measurementState)
  }, [measurementState])


  // console.log(model)
  return <Stack height="100%" justifyContent="center" alignItems="center" gap="20px">
    {['started', 'continuing', 'finishing'].includes(measurementState) && <>
      <CircularProgress />
      {measurementState === 'started'
        ? 'Trwa pomiar'
        : measurementState === 'continuing'
          ? 'Trwa drugi pomiar'
          : 'Generowanie raportu'
      }
    </>}
    {measurementState === 'awaiting' && <>
      Kontynuować drugi pomiar?
      <Stack direction="row" gap="20px">
        <Button variant="outlined" size="large" onClick={finishMeasurement}>Zakończ</Button>
        <Button variant="contained" size="large" onClick={continueMeasurement}>Kontynuuj</Button>
      </Stack>
    </>}
    {measurementState === 'finished' && <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MeasurementSummary model={measuredModel as Model} />
      <Button variant="outlined" onClick={clear} style={{ position: 'absolute', left: '20px', top: '20px' }}>Indeks</Button>
    </div>}
  </Stack>
}

export default Measurement
