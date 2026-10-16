import api, { ApiResponse } from '../../../shared/services/api'

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  city: string
  role: 'Owner' | 'Sitter' | 'Shelter'
  imageUrl?: string
  roleDetails?: {
    // Shelter
    shelterName?: string
    address?: string
    description?: string
    capacity?: number
    // Sitter
    bio?: string
    pricePerHour?: number
  }
}

export interface UpdateProfilePayload {
  firstName: string
  lastName: string
  phoneNumber: string
  city: string
}

export interface UpdateShelterDetailsPayload {
  shelterName: string
  address: string
  description: string
  capacity: number
}

export interface UpdateSitterDetailsPayload {
  bio: string
  pricePerHour: number
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await api.get<ApiResponse<UserProfile>>('/users/profile')
    return data.data
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<void> => {
    await api.put('/users/profile', payload)
  },

  updateShelterDetails: async (payload: UpdateShelterDetailsPayload): Promise<void> => {
    await api.put('/users/shelter-details', payload)
  },

  updateSitterDetails: async (payload: UpdateSitterDetailsPayload): Promise<void> => {
    await api.put('/users/sitter-details', payload)
  },
}