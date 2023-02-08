import { useEffect, useState } from "react"
import apiClient from "../apiClient"
import { directions } from "../constans"
import { Model } from "../types"

type MeasurementState = 'idle' | 'started' | 'awaiting' | 'continuing' | 'finishing' | 'changingBase' | 'finished'
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
    return res
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

  useEffect(() => { // this will fire twice on dev, once on prod, react thing: https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects
    startMeasurement()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const continueMeasurement = async () => {
    setError(false)
    try {
      controller = new AbortController()
      setMeasurementState('continuing')
      const { data } = await apiClient.post('/measure_part_in_right_corner', model.json, { signal: controller.signal })
        .then(extractErrorFromResponse)
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
        .then(extractErrorFromResponse)
      setMeasuredModel(Model.fromDto(data))
      setMeasurementState('finished')
    } catch (e) { setError(e as Error) }
  }

  const changeBase = async (array: number[]) => {
    setError(false)
    try {
      controller = new AbortController()
      setMeasurementState('changingBase')
      const { data } = await apiClient.post('/set_base', array, { signal: controller.signal }, model.json)
        .then(extractErrorFromResponse)
      setMeasuredModel(Model.fromDto(data))
      setMeasurementState('finished')
    } catch (e) { setError(e as Error) }
  }

  const cancelMeasurement = () => {
    if (controller) {
      controller.abort()
    }
  }

  const print = async (ids: string[]) => {
    const openings = measuredModel?.getOpenings() as []
    const cuts = measuredModel?.getCuts() as []
    const elements = [...openings, ...cuts].map(({id, name}) => [id, name])

    if (measuredModel) {
      const selectedJsonElements = Object.entries(measuredModel.json)
        .filter(([name]) => directions.includes(name as typeof directions[number]))
        .flatMap(([, value]) => ([...value.openings, ...value.cuts]))
        .filter(element => ids.includes(element.id))
        .map(element => ({
          ...element,
          name: elements.find(([id]) => element.id === id)?.[1]
        }))

      await apiClient.post('/print', selectedJsonElements)
    }
  }

  return {
    error,
    measuredModel,
    measurementState,
    startMeasurement,
    continueMeasurement,
    finishMeasurement,
    changeBase,
    cancelMeasurement,
    print
  }
}