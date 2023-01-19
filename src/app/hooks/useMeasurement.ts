import axios from "axios"
import { useState } from "react"
import { Model } from "../types"
const isDev = !!process.env.REACT_APP_DEVELOPMENT
console.log(isDev)
const client = isDev
  ? { post: async (url: string, model: Model) => {
    console.log('dev mock for:', url)
    await new Promise(resolve => setTimeout(resolve, 3000))
    return { data: model.json }
  } }
  : axios.create({
    baseURL: process.env.REACT_APP_MEASUREMENT_URL,
    timeout: 180_000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
  })

type MeasurementState = 'idle' | 'started' | 'awaiting' | 'continuing' | 'finishing' | 'finished'

// eslint-disable-next-line import/no-anonymous-default-export
export default (model: Model) => {
  const [measuredModel, setMeasuredModel] = useState<Model | undefined>(undefined)
  const [measurementState, setMeasurementState] = useState<MeasurementState>('idle')
  const startMeasurement = async () => {
    setMeasurementState('started')
    await client.post('/measure_part_in_left_corner', model)
    setMeasurementState('awaiting')
  }
  const continueMeasurement = async () => {
    setMeasurementState('continuing')
    const { data } = await client.post('/measure_part_in_right_corner', model)
    setMeasuredModel(Model.fromDto(data))
    setMeasurementState('finished')
  }
  const finishMeasurement = async () => {
    setMeasurementState('finishing')
    const { data } = await client.post('/get_report', model)
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