"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Camera, Video, Type, Send } from "lucide-react"
import type { Story, User } from "@/types"

interface CreateStoryProps {
  currentUser: User
  users: User[]
  onCreateStory: (story: Omit<Story, "id" | "timestamp" | "expiresAt" | "viewers">) => void
  onClose: () => void
}

export default function CreateStory({ currentUser, users, onCreateStory, onClose }: CreateStoryProps) {
  const [storyType, setStoryType] = useState<"text" | "image" | "video">("text")
  const [content, setContent] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("#000000")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mentions, setMentions] = useState<string[]>([])
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMediaFile(file)
      const url = URL.createObjectURL(file)
      setMediaPreview(url)

      if (file.type.startsWith("image/")) {
        setStoryType("image")
      } else if (file.type.startsWith("video/")) {
        setStoryType("video")
      }
    }
  }

  const handleContentChange = (value: string) => {
    setContent(value)

    // Check for @ mentions
    const mentionRegex = /@(\w+)/g
    const foundMentions = []
    let match

    while ((match = mentionRegex.exec(value)) !== null) {
      foundMentions.push(match[1])
    }

    setMentions(foundMentions)
  }

  const insertMention = (username: string) => {
    const newContent = content + `@${username} `
    setContent(newContent)
    setMentions((prev) => [...prev, username])
    setShowMentions(false)
  }

  const handleCreateStory = () => {
    if ((storyType === "text" && content.trim()) || (storyType !== "text" && mediaFile)) {
      onCreateStory({
        userId: currentUser.id,
        type: storyType,
        content: content,
        mediaUrl: mediaPreview || undefined,
        backgroundColor: storyType === "text" ? backgroundColor : undefined,
        mentions: mentions.length > 0 ? mentions : undefined,
      })
      onClose()
    }
  }

  const backgroundColors = [
    "#000000",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
  ]

  const filteredUsers = users.filter(
    (user) => user.username.toLowerCase().includes(mentionQuery.toLowerCase()) && user.id !== currentUser.id,
  )

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create Story</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs value={storyType} onValueChange={(value) => setStoryType(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" className="flex items-center space-x-1">
                <Type className="h-4 w-4" />
                <span>Text</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center space-x-1">
                <Camera className="h-4 w-4" />
                <span>Image</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center space-x-1">
                <Video className="h-4 w-4" />
                <span>Video</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Background Color</label>
                <div className="flex flex-wrap gap-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        backgroundColor === color ? "border-gray-800" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setBackgroundColor(color)}
                    />
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="What's on your mind? Use @ to mention someone..."
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-32"
              />

              {/* Preview */}
              <div
                className="w-full h-32 rounded-lg flex items-center justify-center text-white font-bold text-center p-4"
                style={{ backgroundColor }}
              >
                {content || "Your text will appear here..."}
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

              <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Select Image
              </Button>

              {mediaPreview && (
                <div className="space-y-2">
                  <img src={mediaPreview || "/placeholder.svg"} alt="Preview" className="w-full rounded-lg" />
                  <Input
                    placeholder="Add a caption... Use @ to mention someone"
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="video" className="space-y-4">
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="video/*" className="hidden" />

              <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Select Video
              </Button>

              {mediaPreview && (
                <div className="space-y-2">
                  <video src={mediaPreview} controls className="w-full rounded-lg" />
                  <Input
                    placeholder="Add a caption... Use @ to mention someone"
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Mention Suggestions */}
          {mentions.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-2">Mentions:</div>
              <div className="flex flex-wrap gap-1">
                {mentions.map((mention, index) => (
                  <span key={index} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm">
                    @{mention}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Mention */}
          <div className="space-y-2">
            <Button variant="outline" size="sm" onClick={() => setShowMentions(!showMentions)} className="w-full">
              Add Mention
            </Button>

            {showMentions && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <Input
                  placeholder="Search users..."
                  value={mentionQuery}
                  onChange={(e) => setMentionQuery(e.target.value)}
                />
                {filteredUsers.slice(0, 5).map((user) => (
                  <Button
                    key={user.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMention(user.username)}
                    className="w-full justify-start"
                  >
                    @{user.username} - {user.displayName}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleCreateStory}
            disabled={(storyType === "text" && !content.trim()) || (storyType !== "text" && !mediaFile)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Share Story
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
