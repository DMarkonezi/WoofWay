import api, { ApiResponse } from '../../../shared/services/api'

export interface AdoptionRequest {
  id: string
  dogId: string
  dogName: string
  adopterId: string
  adopterFullName: string
  status: 'Pending' | 'Approved' | 'Rejected'
  note?: string
}

export const adoptionRequestService = {
  create: async (dogId: string, note?: string): Promise<string> => {
    const { data } = await api.post<ApiResponse<string>>(
      '/adoption-requests',
      { dogId, note }
    )
    return data.data
  },

  getMy: async (): Promise<AdoptionRequest[]> => {
    const { data } = await api.get<ApiResponse<AdoptionRequest[]>>(
      '/adoption-requests/my-requests'
    )
    return data.data
  },

  updateStatus: async (id: string, status: string): Promise<void> => {
    await api.patch(`/adoption-requests/${id}/status`, status, {
      headers: { 'Content-Type': 'application/json' },
    })
  },
}