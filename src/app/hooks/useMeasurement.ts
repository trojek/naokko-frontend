import { useEffect, useState } from "react"
import apiClient from "../apiClient"
import { Model } from "../types"

type MeasurementState = 'idle' | 'started' | 'awaiting' | 'continuing' | 'finishing' | 'finished'

// eslint-disable-next-line import/no-anonymous-default-export
export default (model: Model) => {
  const [measuredModel, setMeasuredModel] = useState<Model | undefined>(undefined)
  const [measurementState, setMeasurementState] = useState<MeasurementState>('idle')

  const startMeasurement = async () => {
    setMeasurementState('started')
    await apiClient.post('/measure_part_in_left_corner', model)
    setMeasurementState('awaiting')
  }

  useEffect(() => {
    startMeasurement()
  }, [])

  const continueMeasurement = async () => {
    setMeasurementState('continuing')
    const { data } = await apiClient.post('/measure_part_in_right_corner', model)
    setMeasuredModel(Model.fromDto(data))
    setMeasurementState('finished')
  }
  
  const finishMeasurement = async () => {
    setMeasurementState('finishing')
    const { data } = await apiClient.post('/get_report', model)
    setMeasuredModel(Model.fromDto(data))
    setMeasurementState('finished')
  }

  return {
    measuredModel,
    measurementState,
    startMeasurement,
    continueMeasurement,
    finishMeasurement
  }
}