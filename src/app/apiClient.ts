import axios from "axios"
import { Model } from "./types"

const isDev = !!process.env.REACT_APP_DEVELOPMENT

type apiResponse = {
  data: any
}

const apiClient = isDev
  ? {
    get: async (url: string) => {
      console.log('dev get mock for:', url)
      const moduleIds = [0, 1, 2, 3, 4, 5]

      const modules = await Promise.all(moduleIds.map(id => import(`./models/${id}.json`)))
      await new Promise(resolve => setTimeout(resolve, 2000))
      return {
        data: modules
      } as apiResponse
    },
    post: async (url: string, data: any) => {
      console.log('dev post mock for:', url)
        return new Promise(resolve => setTimeout(() => resolve({ data: data.json as Model }), 3000)) as Promise<apiResponse>
    }
  }
  : axios.create({
    baseURL: process.env.REACT_APP_MEASUREMENT_URL,
    timeout: 180_000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  })

export default apiClient