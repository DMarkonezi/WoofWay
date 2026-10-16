import api, { ApiResponse } from '../../../shared/services/api'
import { Dog } from '../../dogs/services/dogService'

export interface Shelter {
  id: string
  shelterName: string
  address: string
  description: string
  isVerified: boolean
  dogs: Dog[]
}

export const shelterService = {
  getAll: async (): Promise<Shelter[]> => {
    const { data } = await api.get<ApiResponse<Shelter[]>>('/shelters')
    return data.data
  },

  getById: async (id: string): Promise<Shelter> => {
    const { data } = await api.get<ApiResponse<Shelter>>(`/shelters/${id}`)
    return data.data
  },
}