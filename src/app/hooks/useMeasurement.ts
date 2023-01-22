import { useEffect, useState } from "react"
import apiClient from "../apiClient"
import { Model } from "../types"

type MeasurementState = 'idle' | 'started' | 'awaiting' | 'continuing' | 'finishing' | 'finished'
let controller: undefined | AbortController = undefined

// eslint-disable-next-line import/no-anonymous-default-export
export default (model: Model) => {
  const [measuredModel, setMeasuredModel] = useState<Model | undefined>(undefined)
  const [measurementState, setMeasurementState] = useState<MeasurementState>('idle')
  const [error, setError] = useState<boolean | Error>(false)

  const extractErrorFromResponse = (res: any) => {
    if (res.data?.error) {
      throw new Error(res.data?.error)
    }
  }

  const startMeasurement = async () => {
    setError(false)
    try {
      controller = new AbortController()
      setMeasurementState('started')
      await apiClient.post('/measure_part_in_left_corner', model.json, { signal: controller.signal })
        .then(extractErrorFromResponse)
      setMeasurementState('awaiting')
    } catch (e) { setError(e as Error) }
  }

  useEffect(() => { // this will fire twice on dev, react thing: https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects
    startMeasurement()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const continueMeasurement = async () => {
    setError(false)
    try {
      controller = new AbortController()
      setMeasurementState('continuing')
      const { data } = await apiClient.post('/measure_part_in_right_corner', model.json, { signal: controller.signal })
      setMeasuredModel(Model.fromDto(data))
      setMeasurementState('finished')
    } catch (e) { setError(e as Error) }
  }
  
  const finishMeasurement = async () => {
    setError(false)
    try {
      controller = new AbortController()
      setMeasurementState('finishing')
      const { data } = await apiClient.post('/get_report', model.json, { signal: controller.signal })
      setMeasuredModel(Model.fromDto(data))
      setMeasurementState('finished')
    } catch (e) { setError(e as Error) }
  }

  const cancelMeasurement = () => {
    if (controller) {
      controller.abort()
    }
  }

  return {
    error,
    measuredModel,
    measurementState,
    startMeasurement,
    continueMeasurement,
    finishMeasurement,
    cancelMeasurement
  }
}