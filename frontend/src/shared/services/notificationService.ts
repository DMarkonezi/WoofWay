import api, { ApiResponse } from "./api"

export interface AppNotification {
  id: string
  title: string
  content: string
  isRead: boolean
  createdAt: string
}

export const notificationService = {
  getMy: async (): Promise<AppNotification[]> => {
    const { data } = await api.get<ApiResponse<AppNotification[]>>(
      '/notifications'
    )
    return data.data
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/notifications/${id}/read`)
  },
}