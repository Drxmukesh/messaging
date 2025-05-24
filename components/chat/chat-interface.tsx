"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Mic, Smile } from "lucide-react"
import type { Message, User, Chat } from "@/types"

interface ChatInterfaceProps {
  currentUser: User
  selectedChat: Chat
  messages: Message[]
  users: User[]
  onSendMessage: (content: string, mentions?: string[]) => void
  onSendMedia: (file: File, type: "image" | "video" | "file") => void
}

export default function ChatInterface({
  currentUser,
  selectedChat,
  messages,
  users,
  onSendMessage,
  onSendMedia,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("")
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const position = e.target.selectionStart || 0

    setNewMessage(value)
    setCursorPosition(position)

    // Check for @ mentions
    const beforeCursor = value.slice(0, position)
    const mentionMatch = beforeCursor.match(/@(\w*)$/)

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1])
      setShowMentions(true)
    } else {
      setShowMentions(false)
      setMentionQuery("")
    }
  }

  const insertMention = (username: string) => {
    const beforeCursor = newMessage.slice(0, cursorPosition)
    const afterCursor = newMessage.slice(cursorPosition)
    const beforeMention = beforeCursor.replace(/@\w*$/, "")
    const newValue = `${beforeMention}@${username} ${afterCursor}`

    setNewMessage(newValue)
    setShowMentions(false)
    setMentionQuery("")

    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g
    const mentions = []
    let match

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1])
    }

    return mentions
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const mentions = extractMentions(newMessage)
      onSendMessage(newMessage, mentions)
      setNewMessage("")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file"
      onSendMedia(file, type)
    }
  }

  const filteredUsers = users.filter(
    (user) => user.username.toLowerCase().includes(mentionQuery.toLowerCase()) && user.id !== currentUser.id,
  )

  const getMessageStatus = (message: Message) => {
    switch (message.status) {
      case "sent":
        return "✓"
      case "delivered":
        return "✓✓"
      case "read":
        return "✓✓"
      default:
        return ""
    }
  }

  const renderMessage = (message: Message) => {
    const sender = users.find((u) => u.id === message.senderId)
    const isOwn = message.senderId === currentUser.id

    let content = message.content
    if (message.mentions && message.mentions.length > 0) {
      message.mentions.forEach((mention) => {
        content = content.replace(
          new RegExp(`@${mention}`, "g"),
          `<span class="text-blue-600 font-medium">@${mention}</span>`,
        )
      })
    }

    return (
      <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isOwn ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {!isOwn && selectedChat.type === "group" && (
            <div className="text-xs font-medium mb-1 text-blue-600">{sender?.displayName}</div>
          )}

          {message.type === "text" ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <div className="space-y-2">
              {message.mediaUrl && (
                <div>
                  {message.type === "image" && (
                    <img
                      src={message.mediaUrl || "/placeholder.svg"}
                      alt="Shared image"
                      className="rounded max-w-full"
                    />
                  )}
                  {message.type === "video" && (
                    <video controls className="rounded max-w-full">
                      <source src={message.mediaUrl} />
                    </video>
                  )}
                  {message.type === "file" && (
                    <div className="flex items-center space-x-2 p-2 bg-white/20 rounded">
                      <Paperclip className="h-4 w-4" />
                      <span className="text-sm">{message.fileName}</span>
                    </div>
                  )}
                </div>
              )}
              {message.content && <div>{message.content}</div>}
            </div>
          )}

          <div className="flex items-center justify-between mt-1">
            <span className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {isOwn && (
              <span className={`text-xs ${message.status === "read" ? "text-blue-400" : ""}`}>
                {getMessageStatus(message)}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b bg-gray-50">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={selectedChat.avatar || "/placeholder.svg"} />
          <AvatarFallback>{selectedChat.name?.[0] || selectedChat.participants[0]?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{selectedChat.name || "Direct Message"}</h3>
          <p className="text-sm text-gray-500">
            {selectedChat.type === "group" ? `${selectedChat.participants.length} members` : "Online"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">{messages.map(renderMessage)}</ScrollArea>

      {/* Mention Suggestions */}
      {showMentions && filteredUsers.length > 0 && (
        <div className="border-t bg-white p-2">
          <div className="text-xs text-gray-500 mb-2">Mention someone:</div>
          <div className="flex flex-wrap gap-2">
            {filteredUsers.slice(0, 5).map((user) => (
              <Button
                key={user.id}
                variant="outline"
                size="sm"
                onClick={() => insertMention(user.username)}
                className="h-8"
              >
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{user.displayName[0]}</AvatarFallback>
                </Avatar>
                @{user.username}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,*/*"
          />

          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message... Use @ to mention someone"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button variant="ghost" size="sm">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
