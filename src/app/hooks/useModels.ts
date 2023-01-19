import apiClient from "../apiClient"
import { createGlobalState } from 'react-hooks-global-state';
import { Model, ModelDto } from "../types";

const initialState = { fetching: true };
const { useGlobalState } = createGlobalState(initialState);

let models: Model[] = []
let started = false
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [fetching, setFetching] = useGlobalState('fetching')

  if(models.length === 0 && !started) { // run only once
    console.log('fetching models')
    started = true
    apiClient.get('/get_all_models')
      .then(res => {
        models = res.data.map((module: any) => Model.fromDto(module))
        setFetching(false)
      })
  }

  return {
    fetching,
    list: models,
    getModel: (index: string) => models.find(_ => _.index === index) as Model
  }
}