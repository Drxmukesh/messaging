"use client"

import { useState, useEffect } from "react"
import type { User, Message, Chat, Story, Notification } from "@/types"
import LoginForm from "@/components/auth/login-form"
import ChatInterface from "@/components/chat/chat-interface"
import StoriesSection from "@/components/stories/stories-section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Users, Settings, Bell } from "lucide-react"

export default function WhatsAppClone() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [activeTab, setActiveTab] = useState<"chats" | "stories">("chats")

  // Initialize demo data
  useEffect(() => {
    const demoUsers: User[] = [
      {
        id: "1",
        username: "john_doe",
        displayName: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        bio: "Software Developer",
        isOnline: true,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "2",
        username: "jane_smith",
        displayName: "Jane Smith",
        email: "jane@example.com",
        phone: "+1234567891",
        bio: "Designer",
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 30),
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "3",
        username: "mike_wilson",
        displayName: "Mike Wilson",
        email: "mike@example.com",
        phone: "+1234567892",
        bio: "Product Manager",
        isOnline: true,
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ]

    const demoChats: Chat[] = [
      {
        id: "1",
        type: "direct",
        participants: ["1", "2"],
        unreadCount: 2,
        lastMessage: {
          id: "1",
          senderId: "2",
          content: "Hey! How are you doing?",
          type: "text",
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          status: "delivered",
        },
      },
      {
        id: "2",
        type: "group",
        name: "Team Chat",
        participants: ["1", "2", "3"],
        unreadCount: 0,
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: {
          id: "2",
          senderId: "3",
          content: "Great work on the project @john_doe!",
          type: "text",
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          status: "read",
          mentions: ["john_doe"],
        },
      },
    ]

    const demoMessages: Message[] = [
      {
        id: "1",
        senderId: "2",
        content: "Hey! How are you doing?",
        type: "text",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: "delivered",
      },
      {
        id: "2",
        senderId: "1",
        content: "I'm doing great! Thanks for asking 😊",
        type: "text",
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        status: "read",
      },
    ]

    const demoStories: Story[] = [
      {
        id: "1",
        userId: "2",
        type: "text",
        content: "Having a great day! @john_doe check this out",
        backgroundColor: "#FF6B6B",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22),
        viewers: ["3"],
        mentions: ["john_doe"],
      },
      {
        id: "2",
        userId: "3",
        type: "image",
        content: "Beautiful sunset today!",
        mediaUrl: "/placeholder.svg?height=400&width=300",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23),
        viewers: ["1", "2"],
      },
    ]

    setUsers(demoUsers)
    setChats(demoChats)
    setMessages(demoMessages)
    setStories(demoStories)
  }, [])

  const handleLogin = (credentials: { type: "phone" | "email" | "username"; value: string; password: string }) => {
    // Simulate login - in real app, this would make an API call
    const user: User = {
      id: "1",
      username: "john_doe",
      displayName: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      bio: "Software Developer",
      isOnline: true,
      avatar: "/placeholder.svg?height=40&width=40",
    }
    setCurrentUser(user)
  }

  const handleSendMessage = (content: string, mentions?: string[]) => {
    if (!currentUser || !selectedChat) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content,
      type: "text",
      timestamp: new Date(),
      status: "sent",
      mentions,
    }

    setMessages((prev) => [...prev, newMessage])

    // Update chat's last message
    setChats((prev) => prev.map((chat) => (chat.id === selectedChat.id ? { ...chat, lastMessage: newMessage } : chat)))

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
    }, 1000)
  }

  const handleSendMedia = (file: File, type: "image" | "video" | "file") => {
    if (!currentUser || !selectedChat) return

    const mediaUrl = URL.createObjectURL(file)
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content: "",
      type,
      timestamp: new Date(),
      status: "sent",
      mediaUrl,
      fileName: file.name,
    }

    setMessages((prev) => [...prev, newMessage])
  }

  const handleCreateStory = (storyData: Omit<Story, "id" | "timestamp" | "expiresAt" | "viewers">) => {
    const newStory: Story = {
      ...storyData,
      id: Date.now().toString(),
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      viewers: [],
    }

    setStories((prev) => [...prev, newStory])
  }

  const handleViewStory = (storyId: string) => {
    if (!currentUser) return

    setStories((prev) =>
      prev.map((story) =>
        story.id === storyId && !story.viewers.includes(currentUser.id)
          ? { ...story, viewers: [...story.viewers, currentUser.id] }
          : story,
      ),
    )
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  const getChatMessages = (chatId: string) => {
    return messages.filter((msg) => {
      // For demo purposes, showing all messages in selected chat
      return selectedChat?.id === chatId
    })
  }

  const getChatName = (chat: Chat) => {
    if (chat.type === "group") return chat.name
    const otherParticipant = users.find((u) => chat.participants.includes(u.id) && u.id !== currentUser.id)
    return otherParticipant?.displayName || "Unknown"
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-green-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                <AvatarFallback>{currentUser.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{currentUser.displayName}</div>
                <div className="text-sm text-green-100">@{currentUser.username}</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && <Badge className="ml-1 bg-red-500">{notifications.length}</Badge>}
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <Button
            variant={activeTab === "chats" ? "default" : "ghost"}
            className="flex-1 rounded-none"
            onClick={() => setActiveTab("chats")}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chats
          </Button>
          <Button
            variant={activeTab === "stories" ? "default" : "ghost"}
            className="flex-1 rounded-none"
            onClick={() => setActiveTab("stories")}
          >
            <Users className="h-4 w-4 mr-2" />
            Stories
          </Button>
        </div>

        {/* Chat List */}
        {activeTab === "chats" && (
          <ScrollArea className="flex-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedChat?.id === chat.id ? "bg-green-50" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{getChatName(chat)[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{getChatName(chat)}</h3>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {chat.lastMessage.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage?.content || "No messages yet"}</p>
                      {chat.unreadCount > 0 && <Badge className="bg-green-600">{chat.unreadCount}</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Stories Section */}
        {activeTab === "stories" ? (
          <div className="flex-1">
            <StoriesSection
              currentUser={currentUser}
              stories={stories}
              users={users}
              onCreateStory={handleCreateStory}
              onViewStory={handleViewStory}
            />
          </div>
        ) : selectedChat ? (
          <ChatInterface
            currentUser={currentUser}
            selectedChat={selectedChat}
            messages={getChatMessages(selectedChat.id)}
            users={users}
            onSendMessage={handleSendMessage}
            onSendMedia={handleSendMedia}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-600 mb-2">Select a chat to start messaging</h2>
              <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
