import api, { ApiResponse } from '../../../shared/services/api';

export type DogStatus = 'Lost' | 'Spotted' | 'InShelter' | 'Adopted' | 'Pet';

export interface Dog {
  id: string;
  creatorId: string;
  name?: string;
  status: DogStatus;
  breed?: string;
  detectedBreed?: string
  description: string;
  imageUrl: string;
  location: string;
  eventDate?: string;
  contactPhone?: string;
  age?: number;
}

export interface CreateDogPayload {
  name?: string;
  status: DogStatus;
  breed?: string;
  description: string;
  imageUrl: string;
  location: string;
  eventDate?: string;
  contactPhone?: string;
  age?: number;
}

export interface DogListResponse {
  items: Dog[]
  total: number
}

export const dogService = {

  getAll: async (status?: DogStatus, city?: string): Promise<Dog[]> => {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (city) params.city = city;
    
    const { data } = await api.get<ApiResponse<Dog[]>>('/dogs', { params });
    
    return data.data;
  },

  getMy: async (): Promise<Dog[]> => {
    const { data } = await api.get<ApiResponse<Dog[]>>('/dogs/my');
    return data.data;
  },

  getById: async (id: string): Promise<Dog> => {
    const { data } = await api.get<ApiResponse<Dog>>(`/dogs/${id}`);
    return data.data;
  },

  create: async (payload: CreateDogPayload): Promise<string> => {
    const { data } = await api.post<ApiResponse<string>>('/dogs', payload);
    return data.data;
  },

  updateStatus: async (id: string, status: DogStatus): Promise<void> => {
    await api.patch(`/dogs/${id}/status`, { status });
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/dogs/${id}`);
  },
};