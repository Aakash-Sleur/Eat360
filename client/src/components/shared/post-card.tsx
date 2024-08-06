import { Link } from "react-router-dom";

import { IPost, IUser } from "@/lib/types";
import { getRelativeTime } from "@/lib/utils";
import PostStats from "@/components/shared/post-stats";
import { useImagePreviewModal } from "@/hooks/modal-hooks";


type PostCardProps = {
    post: IPost;
    userDetails?: IUser;
};

const PostCard = ({ post, userDetails }: PostCardProps) => {

    const { onOpen, updateModalData } = useImagePreviewModal()
    const dateString = getRelativeTime(post.createdAt.toString());

    const handlePreviewImage = () => {
        updateModalData({ data: post.image || '' })
        onOpen()
    }


    return (
        <article className="flex flex-col w-full p-6 border-2 border-gray-400 rounded-xl bg-light-2">
            <div className="flex items-center justify-between">
                <div className="flex flex-row flex-1 gap-4">
                    <div className="flex flex-col items-center">
                        <img
                            src={userDetails?.profilePicture || post.author.profilePicture || "/icons/profile-placeholder.svg"}
                            alt="profile picture"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="relative mt-2 w-0.5 grow bg-neutral-800" />
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-3">
                            <Link to={`/profile/${userDetails?._id || post.author._id}`} className="flex items-center gap-2">
                                <h4 className="text-base font-bold capitalize text-dark-1 hover:underline">
                                    {userDetails?.name || post.author.name}
                                </h4>
                                <p className="text-sm cursor-pointer text-light-3">
                                    @{userDetails?.username || post.author.username}
                                </p>
                            </Link>
                            <p className="text-sm text-gray-400">
                                · {dateString}
                            </p>
                        </div>
                        <p className="mt-2 text-sm text-dark-1">{post.text}</p>
                        {post.image && (
                            <img src={post.image} onClick={handlePreviewImage} alt="post image" className="w-full mt-4 cursor-pointer rounded-xl" />
                        )}
                        <PostStats post={post} />
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PostCard;
