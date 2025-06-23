export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';

export interface Message {
  id: number
  content: string
  sender_id: number
  receiver_id: number
  is_read: boolean
  created_at: string
  sender: User
  receiver: User
  status?: MessageStatus
}

export interface UnreadCount {
  count: number
}

export interface User {
  id: number
  name: string
  email: string
  roles: string[]
  avatar?: string
} 