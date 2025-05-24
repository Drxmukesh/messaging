"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { Story, User } from "@/types"

interface StoryViewerProps {
  story: Story
  user: User
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export default function StoryViewer({ story, user, onClose, onNext, onPrevious }: StoryViewerProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onNext()
          return 0
        }
        return prev + 1
      })
    }, 50) // 5 second story duration

    return () => clearInterval(timer)
  }, [onNext])

  const renderStoryContent = () => {
    switch (story.type) {
      case "text":
        return (
          <div
            className="flex items-center justify-center h-full text-white text-2xl font-bold text-center p-8"
            style={{ backgroundColor: story.backgroundColor || "#000" }}
          >
            {story.content}
          </div>
        )
      case "image":
        return <img src={story.mediaUrl || "/placeholder.svg"} alt="Story" className="w-full h-full object-cover" />
      case "video":
        return <video src={story.mediaUrl} autoPlay muted className="w-full h-full object-cover" />
      default:
        return null
    }
  }

  const renderMentions = () => {
    if (!story.mentions || story.mentions.length === 0) return null

    return (
      <div className="absolute bottom-20 left-4 right-4">
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-white text-sm">
            Mentioned: {story.mentions.map((mention) => `@${mention}`).join(", ")}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="w-full bg-gray-600 rounded-full h-1">
          <div className="bg-white h-1 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-white font-medium">{user.displayName}</div>
            <div className="text-white/70 text-sm">
              {Math.floor((Date.now() - story.timestamp.getTime()) / (1000 * 60 * 60))}h ago
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Story Content */}
      <div className="w-full max-w-md h-full max-h-screen relative">
        {renderStoryContent()}
        {renderMentions()}
      </div>

      {/* Viewers Count */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="text-white/70 text-sm text-center">
          {story.viewers.length} {story.viewers.length === 1 ? "view" : "views"}
        </div>
      </div>
    </div>
  )
}
