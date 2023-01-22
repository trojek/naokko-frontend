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
    error,
    measurementState,
    measuredModel,
    startMeasurement,
    continueMeasurement,
    finishMeasurement,
    cancelMeasurement
  } = useMeasurement(model)

  useEffect(() => {
    console.log('measurement state:', measurementState)
  }, [measurementState])

  const cancelAndClearMeasurement = () => {
    cancelMeasurement()
    clear()
  }


  // console.log(model)
  return <Stack height="100%" justifyContent="center" alignItems="center" gap="20px">
    {error
      ? <>
        {measurementState === 'started' && <>
          Błąd pomiaru
          <Stack direction="row" gap="20px">
            <Button variant="outlined" size="large" onClick={cancelAndClearMeasurement}>Anuluj</Button>
            <Button variant="contained" size="large" onClick={startMeasurement}>Ponów</Button>
          </Stack>
        </>}
        {measurementState === 'continuing' && <>
          Błąd drugiego pomiaru
          <Stack direction="row" gap="20px">
            <Button variant="outlined" size="large" onClick={cancelAndClearMeasurement}>Anuluj</Button>
            <Button variant="contained" size="large" onClick={continueMeasurement}>Ponów</Button>
          </Stack>
        </>}
        {measurementState === 'finishing' && <>
          Błąd generowania raportu
          <Stack direction="row" gap="20px">
            <Button variant="outlined" size="large" onClick={cancelAndClearMeasurement}>Anuluj</Button>
            <Button variant="contained" size="large" onClick={finishMeasurement}>Ponów</Button>
          </Stack>
        </>}
      </>
      : <>
        {['started', 'continuing', 'finishing'].includes(measurementState) && <>
          <CircularProgress />
          {measurementState === 'started'
            ? 'Trwa pomiar'
            : measurementState === 'continuing'
              ? 'Trwa drugi pomiar'
              : 'Generowanie raportu'
          }
          <Button variant="outlined" size="large" onClick={cancelAndClearMeasurement}>Anuluj</Button>
        </>}
        {measurementState === 'awaiting' && <>
          Wykonać drugi pomiar?
          <Stack direction="row" gap="20px">
            <Button variant="outlined" size="large" onClick={cancelAndClearMeasurement}>Anuluj</Button>
            <Button variant="contained" color="secondary" size="large" onClick={finishMeasurement}>Raport</Button>
            <Button variant="contained" size="large" onClick={continueMeasurement}>Wykonaj</Button>
          </Stack>
        </>}
        {measurementState === 'finished' && <div style={{ height: '100%', width: '100%', position: 'relative' }}>
          <MeasurementSummary model={measuredModel as Model} />
          <Button variant="outlined" onClick={clear} style={{ position: 'absolute', left: '20px', top: '20px' }}>Indeks</Button>
        </div>}
      </>}
  </Stack>
}

export default Measurement
