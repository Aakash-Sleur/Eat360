import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface UserProfileProps {
  user: {
    _id: string
    name: string
    profilePicture: string
  }
  isOnline: boolean
  isOtherUserOnline: boolean
}

export function UserProfile({ user, isOnline, isOtherUserOnline }: UserProfileProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarImage src={user.profilePicture || "/icons/profile-placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-3 border-card transition-all duration-300 ${
              isOnline ? "bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" : "bg-gray-400"
            }`}
          />
        </div>
        <div>
          <h2 className="font-semibold text-foreground text-lg">{user.name}</h2>
          <p className="text-sm text-muted-foreground">
            {isOtherUserOnline ? (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            ) : (
              "Offline"
            )}
          </p>
        </div>
      </div>
      <button className="p-2 hover:bg-secondary rounded-lg transition-colors duration-200 text-muted-foreground hover:text-foreground">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>
    </div>
  )
}
