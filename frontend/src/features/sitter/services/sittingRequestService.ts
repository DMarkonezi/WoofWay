import api, { ApiResponse } from '../../../shared/services/api'

export interface SittingRequest {
  id: string
  sittingOfferId: string
  offerTitle: string
  ownerId: string
  ownerName: string
  dogId: string
  dogName: string
  startTime: string
  endTime: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
  totalPrice: number
  note?: string
}

export interface CreateSittingRequestPayload {
  sittingOfferId: string
  dogId: string
  startTime: string
  endTime: string
  note?: string
}

export const sittingRequestService = {
  getMy: async (): Promise<SittingRequest[]> => {
    const { data } = await api.get<ApiResponse<SittingRequest[]>>(
      '/sitting-requests/my'
    )
    return data.data
  },

  create: async (payload: CreateSittingRequestPayload): Promise<string> => {
    const { data } = await api.post<ApiResponse<string>>(
      '/sitting-requests', payload
    )
    return data.data
  },

  updateStatus: async (id: string, status: 'Approved' | 'Rejected'): Promise<void> => {
    await api.patch(`/sitting-requests/${id}/status`, { status })
  },

  cancel: async (id: string): Promise<void> => {
    await api.patch(`/sitting-requests/${id}/cancel`)
  },
}