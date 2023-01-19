import { useState } from "react"
import { Model } from "../types"

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [fetching, setFetching] = useState(true)
  const [list, setList] = useState<ModelWrapper[]>([])
  const moduleIds = [1, 2, 3, 4, 5]

  if(list.length === 0) { // run only once
    console.log('fetching models')
    Promise.all(moduleIds.map(id => import(`../models/${id}.json`)))
      .then(modules => {
        const list = modules.map((module, idx) => 
          ({ id: String(`Model numer ${moduleIds[idx]}`), json: Model.fromDto(module) } as ModelWrapper))

        setList(list)
        setFetching(false)
      })
  }

  return {
    fetching,
    list,
    getModel: (id: string) => list.find(_ => _.id === id) as ModelWrapper
  }
}