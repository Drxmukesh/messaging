export interface User {
  id: string
  username: string
  phone?: string
  email?: string
  displayName: string
  avatar?: string
  bio?: string
  isOnline: boolean
  lastSeen?: Date
}

export interface Message {
  id: string
  senderId: string
  content: string
  type: "text" | "image" | "video" | "file" | "voice"
  timestamp: Date
  status: "sent" | "delivered" | "read"
  mentions?: string[]
  replyTo?: string
  mediaUrl?: string
  fileName?: string
}

export interface Chat {
  id: string
  type: "direct" | "group"
  name?: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  avatar?: string
}

export interface Story {
  id: string
  userId: string
  type: "text" | "image" | "video"
  content: string
  mediaUrl?: string
  backgroundColor?: string
  timestamp: Date
  expiresAt: Date
  viewers: string[]
  mentions?: string[]
}

export interface Notification {
  id: string
  type: "message" | "mention" | "story_mention"
  title: string
  body: string
  timestamp: Date
  read: boolean
  data?: any
}
