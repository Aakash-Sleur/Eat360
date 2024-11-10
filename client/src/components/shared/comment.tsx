'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { Loader } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"

import { CommentValidation } from "@/lib/validations"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserContext } from "@/context/auth-store"
import { useCreateComment, useCreateRecipeComment } from "@/lib/react-query/queries-and-mutations"
import { INewComment } from "@/lib/types"

type CommentProps = {
    postId?: string
    recipeId?: string
}

export default function Comment({ postId, recipeId }: CommentProps) {
    const { user: { _id: currentUserId, profilePicture: currentUserImage, name: currentUserName } } = useUserContext()
    const { mutateAsync: createComment, isPending } = useCreateComment()
    const { mutateAsync: createRecipeComment, isPending: isRecipePending } = useCreateRecipeComment()

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            comment: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        const data: INewComment = {
            id: postId || recipeId,
            text: values.comment,
            author: currentUserId,
        }

        await (postId ? createComment(data) : createRecipeComment(data))
        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem className="flex items-start space-x-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={currentUserImage || "/icons/profile-placeholder.svg"} alt={`${currentUserName}'s profile picture`} />
                                <AvatarFallback>{currentUserName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <FormControl className="flex-1">
                                <Input
                                    {...field}
                                    placeholder="Add a comment..."
                                    className="min-h-[80px] resize-none bg-background"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending || isRecipePending}>
                        {isPending || isRecipePending ? (
                            <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Post Comment"
                        )}
                    </Button>
                </div>
                <FormMessage />
            </form>
        </Form>
    )
}