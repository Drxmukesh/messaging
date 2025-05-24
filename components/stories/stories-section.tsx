"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Eye } from "lucide-react"
import type { Story, User } from "@/types"
import StoryViewer from "./story-viewer"
import CreateStory from "./create-story"

interface StoriesSectionProps {
  currentUser: User
  stories: Story[]
  users: User[]
  onCreateStory: (story: Omit<Story, "id" | "timestamp" | "expiresAt" | "viewers">) => void
  onViewStory: (storyId: string) => void
}

export default function StoriesSection({
  currentUser,
  stories,
  users,
  onCreateStory,
  onViewStory,
}: StoriesSectionProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [showCreateStory, setShowCreateStory] = useState(false)

  // Group stories by user
  const storiesByUser = stories.reduce(
    (acc, story) => {
      if (!acc[story.userId]) {
        acc[story.userId] = []
      }
      acc[story.userId].push(story)
      return acc
    },
    {} as Record<string, Story[]>,
  )

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story)
    onViewStory(story.id)
  }

  const myStories = storiesByUser[currentUser.id] || []
  const otherUsersWithStories = Object.keys(storiesByUser)
    .filter((userId) => userId !== currentUser.id)
    .map((userId) => ({
      user: users.find((u) => u.id === userId)!,
      stories: storiesByUser[userId],
    }))

  return (
    <div className="border-b bg-white">
      <ScrollArea className="w-full">
        <div className="flex space-x-4 p-4">
          {/* My Story */}
          <div className="flex flex-col items-center space-y-2 min-w-0">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-gray-300">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                <AvatarFallback>{currentUser.displayName[0]}</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-600 hover:bg-green-700 p-0"
                onClick={() => setShowCreateStory(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-xs text-center truncate w-16">{myStories.length > 0 ? "My Story" : "Add Story"}</span>
            {myStories.length > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                <Eye className="h-3 w-3 mr-1" />
                {myStories.reduce((acc, story) => acc + story.viewers.length, 0)}
              </div>
            )}
          </div>

          {/* Other Users' Stories */}
          {otherUsersWithStories.map(({ user, stories: userStories }) => {
            const latestStory = userStories[userStories.length - 1]
            const hasUnviewed = userStories.some((story) => !story.viewers.includes(currentUser.id))

            return (
              <div
                key={user.id}
                className="flex flex-col items-center space-y-2 min-w-0 cursor-pointer"
                onClick={() => handleStoryClick(latestStory)}
              >
                <Avatar className={`h-16 w-16 border-2 ${hasUnviewed ? "border-green-500" : "border-gray-300"}`}>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-center truncate w-16">{user.displayName}</span>
                <span className="text-xs text-gray-500">
                  {Math.floor((Date.now() - latestStory.timestamp.getTime()) / (1000 * 60 * 60))}h
                </span>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          user={users.find((u) => u.id === selectedStory.userId)!}
          onClose={() => setSelectedStory(null)}
          onNext={() => {
            // Logic to show next story
          }}
          onPrevious={() => {
            // Logic to show previous story
          }}
        />
      )}

      {/* Create Story Modal */}
      {showCreateStory && (
        <CreateStory
          currentUser={currentUser}
          users={users}
          onCreateStory={onCreateStory}
          onClose={() => setShowCreateStory(false)}
        />
      )}
    </div>
  )
}
