import { Link } from "react-router-dom";

import { useGetUserById } from "@/lib/react-query/queries-and-mutations"
import { IComment } from "@/lib/types"
import Loader from "@/components/loader";
import { getRelativeTime } from "@/lib/utils";

const CommentCard = ({ comment }: { comment: IComment }) => {
    const { data: author } = useGetUserById(comment.author);

    if (!author) return <Loader />
    const createdAt = getRelativeTime((comment.createdAt).toString());

    return (
        <div className="flex w-full p-4 rounded-md">
            <Link to={`/profile/${author._id}`}>
                <img
                    src={author.profilePicture || "/icons/profile-placeholder.svg"}
                    alt="author-profile-picture"
                    className="rounded-full size-10"
                />
            </Link>
            <div className="flex flex-col ml-4">
                <div className="flex items-center gap-x-4">
                    <h3 className="base-semibold">{author.username}</h3>
                    <time className="text-light-4">{createdAt}</time>
                </div>
                <p className="p-3">{comment.text}</p>
            </div>
        </div>
    )
}

export default CommentCard
