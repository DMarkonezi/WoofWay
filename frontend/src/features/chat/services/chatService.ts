import api, { ApiResponse } from '../../../shared/services/api'

export interface ChatRoom {
  id: string
  requestId: string
  participants: string[]
  lastMessagePreview: string
  lastMessageAt: string
}

export interface ChatMessage {
  id: string
  chatRoomId: string
  senderId: string
  content: string
  isRead: boolean
  timestamp: string
}

export const chatService = {
  getMyRooms: async (): Promise<ChatRoom[]> => {
    const { data } = await api.get<ApiResponse<ChatRoom[]>>('/chat/rooms')
    return data.data
  },

  openRoom: async (requestId: string, type: 'Sitting' | 'Adoption'): Promise<ChatRoom> => {
    const { data } = await api.post<ApiResponse<ChatRoom>>('/chat/rooms/open', {
      requestId,
      type,
    })
    return data.data
  },

  getMessages: async (roomId: string): Promise<ChatMessage[]> => {
    const { data } = await api.get<ApiResponse<ChatMessage[]>>(
      `/chat/rooms/${roomId}/messages`
    )
    return data.data
  },
}