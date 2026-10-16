import api, { ApiResponse } from '../../../shared/services/api'

export type UserRole = 'Owner' | 'Sitter' | 'Shelter' | 'Admin' 

export interface CurrentUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface LoginPayload {
  email: string
  password: string
}

interface LoginData {
  token: string
  username: string
}

interface BaseRegisterPayload {
  email: string
  password: string
  role: UserRole
  firstName: string
  lastName: string
  phoneNumber: string
  city: string
}

export interface OwnerRegisterPayload extends BaseRegisterPayload {
  role: 'Owner'
}

export interface SitterRegisterPayload extends BaseRegisterPayload {
  role: 'Sitter'
}

export interface ShelterRegisterPayload extends BaseRegisterPayload {
  role: 'Shelter'
  shelterName: string
  address: string
  registrationNumber: string
  capacity: number
  description: string
}

export type RegisterPayload =
  | OwnerRegisterPayload
  | SitterRegisterPayload
  | ShelterRegisterPayload

export const authService = {
  login: async (payload: LoginPayload): Promise<ApiResponse<LoginData>> => {
    const { data } = await api.post<ApiResponse<LoginData>>('/auth/login', payload)
    return data
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<string>> => {
    const { data } = await api.post<ApiResponse<string>>('/auth/register', payload)
    return data
  },

  me: async (): Promise<CurrentUser> => {
    const { data } = await api.get<ApiResponse<CurrentUser>>('/auth/me')
    return data.data
  },

  saveToken: (token: string): void => {
    localStorage.setItem('woof_token', token)
  },

  setToken: (token: string): void => {
    localStorage.setItem('woof_token', token)
  },

  logout: (): void => {
    localStorage.removeItem('woof_token')
  },
}