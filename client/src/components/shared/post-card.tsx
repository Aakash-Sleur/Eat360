import { IPost, IUser } from "@/lib/types"
import { getRelativeTime } from "@/lib/utils"
import { useImagePreviewModal } from "@/hooks/modal-hooks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import PostStats from "@/components/shared/post-stats"
import { Link } from "react-router-dom"

type PostCardProps = {
    post: IPost
    userDetails?: IUser
}

export default function PostCard({ post, userDetails }: PostCardProps) {
    const { onOpen, updateModalData } = useImagePreviewModal()
    const dateString = getRelativeTime(post.createdAt.toString())

    console.log(post, userDetails)

    const handlePreviewImage = () => {
        updateModalData({ data: post.image || '' })
        onOpen()
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center pb-4 space-x-4">
                <Avatar>
                    <AvatarImage src={userDetails?.profilePicture || post.author.profilePicture || "/icons/profile-placeholder.svg"} alt="Profile picture" />
                    <AvatarFallback>{userDetails?.name?.[0] || post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <Link to={`/profile/${userDetails?._id || post.author._id}`} className="font-semibold hover:underline">
                        {userDetails?.name || post.author.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        @{userDetails?.username || post.author.username} · {dateString}
                    </p>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-sm text-card-foreground">{post.text}</p>
                {post.image && (
                    <img
                        src={post.image}
                        alt="Post image"
                        className="w-full rounded-md cursor-pointer"
                        onClick={handlePreviewImage}
                    />
                )}
            </CardContent>
            <CardFooter>
                <PostStats post={post} />
            </CardFooter>
        </Card>
    )
}