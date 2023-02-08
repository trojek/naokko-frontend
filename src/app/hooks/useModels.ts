import apiClient from "../apiClient"
import { createGlobalState } from 'react-hooks-global-state';
import { Model } from "../types";

const initialState = { fetching: true, error: false };
const { useGlobalState } = createGlobalState(initialState);

let models: Model[] = []
let started = false
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [fetching, setFetching] = useGlobalState('fetching')
  const [error, setError] = useGlobalState('error')

  const fetchModels = () => {
    setFetching(true)
    setError(false)
    console.log('fetching models')
    started = true
    apiClient.get('/get_all_models')
      .then(res => {
        models = res.data.map((module: any) => Model.fromDto(module))
        setFetching(false)
      })
      .catch(() => {
        setFetching(false)
        setError(true)
        setTimeout(fetchModels, 5000)
      })
  }

  if(!started) { // run only once
    fetchModels()
  }

  return {
    fetching,
    error,
    list: models,
    getModel: (index: string) => models.find(_ => _.index === index) as Model
  }
}