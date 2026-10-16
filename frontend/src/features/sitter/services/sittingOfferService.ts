import api, { ApiResponse } from '../../../shared/services/api'

export interface Availability {
  dayOfWeek: string
  fromTime: string
  toTime: string
  note?: string
}

export interface SittingOffer {
  id: string
  sitterId: string
  title: string
  description: string
  pricePerHour: number
  maxDogsCapacity: number
  isActive: boolean
  city: string
  weeklyAvailabilities: Availability[]
}

export interface CreateSittingOfferPayload {
  title: string
  description: string
  pricePerHour: number
  maxDogsCapacity: number
  weeklyAvailabilities: Availability[]
}

export interface UpdateSittingOfferPayload extends CreateSittingOfferPayload {
  isActive: boolean
}

export const sittingOfferService = {
  getAll: async (city?: string): Promise<SittingOffer[]> => {
    const params: Record<string, string> = {}
    if (city) params.city = city
    const { data } = await api.get<ApiResponse<SittingOffer[]>>(
      '/sitting-offers', { params }
    )
    return data.data
  },

  getMy: async (): Promise<SittingOffer[]> => {
    const { data } = await api.get<ApiResponse<SittingOffer[]>>(
      '/sitting-offers/my'
    )
    return data.data
  },

  getById: async (id: string): Promise<SittingOffer> => {
    const { data } = await api.get<ApiResponse<SittingOffer>>(
      `/sitting-offers/${id}`
    )
    return data.data
  },

  create: async (payload: CreateSittingOfferPayload): Promise<string> => {
    const { data } = await api.post<ApiResponse<string>>(
      '/sitting-offers', payload
    )
    return data.data
  },

  update: async (id: string, payload: UpdateSittingOfferPayload): Promise<void> => {
    await api.put(`/sitting-offers/${id}`, payload)
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sitting-offers/${id}`)
  },
}