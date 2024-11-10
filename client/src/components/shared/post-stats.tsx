import { useEffect, useState } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import { IPost } from '@/lib/types'
import { Button } from "@/components/ui/button"
import { checkIfExist } from "@/lib/utils"
import ShareButton from "@/components/buttons/share-button"
import { useUserContext } from "@/context/auth-store"
import { useDeletePost, useUpdatePost } from "@/lib/react-query/queries-and-mutations"
import { Eye, Heart, MessageCircle, Share2, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PostStatsProps {
    post: IPost
}

export default function PostStats({ post }: PostStatsProps) {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { user: { _id: userId } } = useUserContext()
    const [isLiked, setIsLiked] = useState(checkIfExist(post.likedBy, userId))

    const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost()
    const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost()

    useEffect(() => {
        const updateView = async () => {
            if (!checkIfExist(post.viewedBy, userId) && pathname !== "/posts") {
                await updatePost({
                    _id: post._id,
                    viewedBy: [...post.viewedBy, userId],
                    views: post.views + 1
                })
            }
        }

        updateView()
    }, [post, updatePost, userId, pathname])

    const onDelete = async () => {
        await deletePost(post._id)
        if (pathname === `/posts/${post._id}`) {
            navigate("/posts")
        }
    }

    const onLike = async () => {
        if (!checkIfExist(post.likedBy, userId)) {
            await updatePost({
                _id: post._id,
                likedBy: [...post.likedBy, userId],
                likes: post.likes + 1
            })
            setIsLiked(true)
        } else {
            await updatePost({
                _id: post._id,
                likedBy: post.likedBy.filter((id) => id !== userId),
                likes: post.likes - 1
            })
            setIsLiked(false)
        }
    }

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="p-0"
                                onClick={onLike}
                                disabled={isUpdating}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                                <span className="ml-1 text-sm">{post.likes}</span>
                                <span className="sr-only">{isLiked ? 'Unlike' : 'Like'}</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{isLiked ? 'Unlike' : 'Like'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-0"
                                onClick={() => navigate(`/posts/${post._id}`)}
                            >
                                <MessageCircle className="w-5 h-5 text-gray-500" />
                                <span className="ml-1 text-sm">{post.comments?.length || 0}</span>
                                <span className="sr-only">Comments</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>View Comments</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0">
                                <Eye className="w-5 h-5 text-gray-500" />
                                <span className="ml-1 text-sm">{post.views}</span>
                                <span className="sr-only">Views</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Views</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-center space-x-4">
                <ShareButton id={post._id} type="posts">
                    <Share2 className="w-5 h-5 text-gray-500" />
                </ShareButton>

                {post.author._id === userId && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0"
                                    onClick={onDelete}
                                    disabled={isUpdating || isDeleting}
                                >
                                    {isDeleting ? (
                                        <span className="loading loading-spinner loading-xs" />
                                    ) : (
                                        <Trash2 className="w-5 h-5 text-gray-500" />
                                    )}
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete Post</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    )
}