import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import PostCard from "@/components/shared/post-card";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useGetPosts } from "@/lib/react-query/queries-and-mutations";
import { useCreatePostModal } from "@/hooks/modal-hooks";

const PostsPage = () => {
    const { ref, inView } = useInView();
    const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
    const { onOpen } = useCreatePostModal();

    useEffect(() => {
        if (inView) fetchNextPage();
    }, [inView])

    if (!posts) {
        return <Loader />
    }

    return (
        <section className="general-container">
            <div className="flex items-center justify-between w-full">
                <h2 className="w-full text-left h3-bold md:h2-bold">Posts</h2>
                <Button type="button" onClick={onOpen} >
                    <img src="/icons/create.svg" alt="add-post" className="size-10" />
                </Button>
            </div>

            <ul className="flex flex-col gap-4">
                {
                    posts.pages.map((page, index) => (
                        <React.Fragment key={index}>
                            {
                                page?.map((post) => (
                                    <li key={post._id} className="w-full">
                                        <PostCard post={post} />
                                    </li>
                                ))
                            }
                        </React.Fragment>
                    ))
                }
            </ul>
            {hasNextPage && (
                <div ref={ref} className="mt-10">
                    <Loader />
                </div>
            )}
        </section>
    )
}

export default PostsPage
