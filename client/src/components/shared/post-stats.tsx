import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

import { IPost } from '@/lib/types';
import { Button } from "../ui/button";
import { checkIfExist } from "@/lib/utils";
import ShareButton from "../buttons/share-button";
import { useUserContext } from "@/context/auth-store";
import { useDeletePost, useUpdatePost } from "@/lib/react-query/queries-and-mutations";

const PostStats = ({ post }: { post: IPost }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user: {
        _id: userId
    } } = useUserContext();
    const [isLiked, setIsLiked] = useState(checkIfExist(post.likedBy, userId))

    const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost()
    const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost();

    useEffect(() => {
        const updateView = async () => {
            if (!checkIfExist(post.viewedBy, userId) && pathname !== "/posts") {
                console.log("up")
                await updatePost({
                    _id: post._id,
                    viewedBy: [...post.viewedBy, userId],
                    views: post.views + 1

                });
            }
        };

        updateView();
    }, [post, updatePost, userId]);

    const onDelete = async () => {
        await deletePost(post._id);
        if (pathname === `/posts/${post._id}`) {
            navigate("/posts");
        }
    }

    const onLike = async () => {
        if (!checkIfExist(post.likedBy, userId)) {
            await updatePost({
                _id: post._id,
                likedBy: [...post.likedBy, userId],
                likes: post.likes + 1
            })
            setIsLiked(true);
        } else {
            await updatePost({
                _id: post._id,
                likedBy: post.likedBy.filter((id) => id !== userId),
                likes: post.likes - 1
            })
            setIsLiked(false);
        }
    }


    return (

        <div className="flex flex-col gap-3 mt-4">
            <nav className="flex items-center gap-x-4 w-fit">
                <div className="flex items-center gap-1">
                    <Button className="p-0 m-0" onClick={onLike}>
                        {isLiked ? <img
                            src="/icons/liked.svg"
                            className="cursor-pointer size-5"
                            alt="liked"
                        /> : <img
                            src="/icons/like.svg"
                            className="cursor-pointer size-5"
                            alt="like"
                        />}
                    </Button>
                    <span className="text-sm text-dark-1">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                    <img
                        src="/icons/eye.svg"
                        className="w-5 h-5 cursor-pointer"
                        alt="views"
                    />
                    <span className="text-sm text-dark-1">{post.views}</span>
                </div>
                <div className="flex items-center gap-1">
                    <ShareButton id={post._id} type="posts">
                        {""}
                    </ShareButton>
                </div>
                <div className="flex items-center gap-1" onClick={() => navigate(`/posts/${post._id}`)}>
                    <img src="/icons/reply.svg" alt="plus icon" className="cursor-pointer size-6" />
                </div>

                {post.author._id == userId && (

                    <div className="flex items-center gap-1">
                        <Button className="p-0 m-0" type="button" disabled={isUpdating || isDeleting} onClick={onDelete}>

                            {isDeleting
                                ? <img
                                    src="/gifs/delete.gif"
                                    className="w-5 h-5 cursor-pointer"
                                    alt="delete"
                                />
                                : <img
                                    src="/icons/delete.svg"
                                    className="w-5 h-5 cursor-pointer"
                                    alt="delete"
                                />}
                        </Button>
                    </div>
                )}
            </nav>
        </div>
    )
}

export default PostStats
