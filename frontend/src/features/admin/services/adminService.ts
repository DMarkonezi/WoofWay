import api, { ApiResponse } from '../../../shared/services/api'
import { SittingOffer } from '../../sitter/services/sittingOfferService'
import { CurrentUser } from '../../auth/services/authService'

export interface PendingShelter {
  shelterId: string
  userId: string
  shelterName: string
  registrationNumber: string
  address: string
  capacity: number
  description: string
  contactEmail: string
  createdAt: string
}

export const adminService = {
  getPendingShelters: async (): Promise<PendingShelter[]> => {
    const { data } = await api.get<ApiResponse<PendingShelter[]>>(
      '/admin/shelters/pending'
    )
    return data.data
  },

  approveShelter: async (id: string): Promise<void> => {
    await api.post(`/admin/shelters/${id}/approve`)
  },

  rejectShelter: async (id: string): Promise<void> => {
    await api.delete(`/admin/shelters/${id}/reject`)
  },

  getAllUsers: async (): Promise<CurrentUser[]> => {
    const { data } = await api.get<ApiResponse<CurrentUser[]>>('/admin/users')
    return data.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`)
  },

  getAllOffers: async (): Promise<SittingOffer[]> => {
    const { data } = await api.get<ApiResponse<SittingOffer[]>>('/admin/offers')
    return data.data
  },

  deleteOffer: async (id: string): Promise<void> => {
    await api.delete(`/admin/offers/${id}`)
  },
}