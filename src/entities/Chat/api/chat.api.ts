import { api } from 'src/boot/axios'
import type { Message, UnreadCount, User } from '../model/chat.model'

export const chatApi = {
  getUsers() {
    return api.get<User[]>('/messages/users')
  },

  getMessages(userId: number) {
    return api.get<Message[]>(`/messages?user_id=${userId}`)
  },

  sendMessage(content: string, receiverId: number) {
    return api.post<Message>('/messages', { content, receiver_id: receiverId })
  },

  getUnreadCount() {
    return api.get<UnreadCount>('/messages/unread-count')
  },

  markAsDelivered(messageId: number) {
    return api.post(`/messages/${messageId}/delivered`)
  },

  markAsRead(messageId: number) {
    return api.post(`/messages/${messageId}/read`)
  },

  getUnreadByUser() {
    return api.get<Record<number, number>>('/messages/unread-by-user')
  }
} 