import api from '../../../shared/services/api'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors: null
}

export interface AdoptionRequest {
  id: string
  dogId: string
  dogName: string
  adopterId: string
  adopterFullName: string
  status: 'Pending' | 'Approved' | 'Rejected'
  note?: string
}

export const shelterAdoptionService = {
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