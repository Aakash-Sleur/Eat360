import { z } from "zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { CommentValidation } from "@/lib/validations";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from '@/components//ui/input';
import { useUserContext } from "@/context/auth-store";
import { useCreateComment, useCreateRecipeComment } from "@/lib/react-query/queries-and-mutations";
import { INewComment } from "@/lib/types";

type CommentProps = {
    postId?: string;
    recipeId?: string;
}

const Comment = ({
    postId,
    recipeId,
}: CommentProps) => {

    const { user: {
        _id: currentUserId,
        profilePicture: currentUserImage
    } } = useUserContext();
    const { mutateAsync: createComment, isPending } = useCreateComment();
    const { mutateAsync: createRecipeComment, isPending: isRecipePending } = useCreateRecipeComment();

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
        };

        await (postId ? createComment(data) : createRecipeComment(data));
        form.reset();
    };

    return (
        <Form {...form}>
            <form
                className="comment-form"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField

                    control={form.control}
                    name='comment'
                    render={({ field }) => (
                        <FormItem className='flex items-center w-full gap-3'>
                            <FormLabel>
                                <img
                                    src={currentUserImage || "/icons/profile-placeholder.svg"}
                                    alt='Profile image'
                                    width={48}
                                    height={48}
                                    className='object-cover rounded-full'
                                />
                            </FormLabel>
                            <FormControl className='bg-transparent border-none'>
                                <Input
                                    type='text'
                                    {...field}
                                    placeholder='Comment'
                                    className='outline-none no-focus text-dark-1'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type='submit' className='comment-form_btn'>
                    {isPending || isRecipePending ? <Loader className="animate-spin" /> : "Send"}
                </Button>
            </form>
        </Form>
    )
}

export default Comment
