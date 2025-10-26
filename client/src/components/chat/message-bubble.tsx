import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

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

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={message.sender.profilePicture || "/placeholder.svg"} alt={message.sender.name} />
        <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`max-w-xs px-4 py-2 rounded-lg ${
            isOwn ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
          }`}
        >
          <p className="text-sm break-words">{message.message}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  )
}
