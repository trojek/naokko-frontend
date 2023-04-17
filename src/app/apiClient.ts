import axios from "axios"
import { Model } from "./types"

const isDev = !!process.env.REACT_APP_DEVELOPMENT

type MockApiResponse = {
  data: any
}

const apiClient = isDev
  ? {
    get: async (url: string) => {
      console.log('dev get mock for:', url)
      const moduleIds = [6]

      const modules = await Promise.all(moduleIds.map(id => import(`./models/${id}.json`)))
      // await new Promise(resolve => setTimeout(resolve, 500))

      return {
        data: modules
      } as MockApiResponse
    },
    post: async (url: string, data: any = {}, opts?: any, json?: Model['json']) => {
      console.log('dev post mock for:', url, data)
      const moduleIds = [6]
      const modules = await Promise.all(moduleIds.map(id => import(`./models/${id}.json`)))
      return new Promise((resolve) => setTimeout(() => resolve({ data: modules[0] }), 0)) as Promise<MockApiResponse>
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