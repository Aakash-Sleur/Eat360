import type React from "react"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./type-indicator"

interface Message {
  _id: string
  sender: {
    _id: string
    name: string
    profilePicture: string
  }
  message: string
  createdAt: string
}

interface MessageListProps {
  messages: Message[]
  currentUserId: string
  isTyping: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function MessageList({ messages, currentUserId, isTyping, messagesEndRef }: MessageListProps) {
  return (
    <div className="flex flex-col p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center flex-1 h-[60vh]">
          <div className="text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-muted-foreground text-lg">No messages yet. Start a conversation!</p>
          </div>
        </div>
      ) : (
        messages.map((msg) => <MessageBubble key={msg._id} message={msg} isOwn={msg.sender._id === currentUserId} />)
      )}

      {isTyping && (
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <TypingIndicator />
          <span className="text-sm text-muted-foreground">
            {messages[messages.length - 1]?.sender.name} is typing...
          </span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
