import { useParams } from "react-router-dom";

import Loader from "@/components/loader";
import Comment from "@/components/shared/comment";
import CommentCard from "@/components/shared/comment-card";
import PostCard from "@/components/shared/post-card";
import { useGetPostById } from "@/lib/react-query/queries-and-mutations";

const PostDetailsPage = () => {
    const { postId } = useParams();
    const { data: post } = useGetPostById(postId || "");

    if (!post) return <Loader />
    return (
        <section className="relative w-full p-5 overflow-scroll custom-scrollbar">
            <div>
                <PostCard post={post} />
            </div>
            <div className="mt-4">
                <Comment postId={post._id} />
            </div>
            <div className="mt-4 space-y-4">
                {
                    !post.comments
                        ? <div>Comments are not available</div>
                        : <>
                            {post.comments.map((comment) =>
                                <CommentCard comment={comment} key={comment._id} />
                            )}
                        </>
                }
            </div>
        </section>
    )
}

export default PostDetailsPage
