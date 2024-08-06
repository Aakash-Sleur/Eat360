import { z } from "zod";
import { useState } from 'react';
import { Image, Loader, Send } from 'lucide-react';

import { useForm } from "react-hook-form";
import { Modal } from '@/components/ui/modal'
import { useCreatePostModal } from '@/hooks/modal-hooks'
import { PostValidation } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from '../ui/textarea';
import { useCreatePost } from '@/lib/react-query/queries-and-mutations';
import { useUserContext } from '@/context/auth-store';
import { uploadImage } from '@/lib/api/upload';
import { ICreatePost } from '@/lib/types';
import FileUploader from '@/components/shared/file-uploader';

const CreatePostModal = () => {
    const { isOpen, onClose } = useCreatePostModal();
    const [enableImage, setEnableImage] = useState(false);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const { mutateAsync: createPost, isPending } = useCreatePost();
    const { user: {
        _id: currentUserId,
    } } = useUserContext();

    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            text: '',
            file: []
        }
    })

    const onSubmit = async (values: z.infer<typeof PostValidation>) => {
        const data: ICreatePost = {
            text: values.text,
            author: currentUserId
        }
        if (isFileUploaded) {
            const image = await uploadImage(values.file[0])
            data.image = image
        }
        await createPost({
            ...data
        });

        form.reset()
        onClose();
    }
    return (
        <Modal
            title='Create Post'
            description=''
            isOpen={isOpen}
            onClose={() => {
                onClose();
                form.reset();
                setEnableImage(false);
                setIsFileUploaded(false);
            }
            }
            styles='h-fit w-[75%]'
        >
            <Form {...form}>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name='text'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>

                                </FormLabel>
                                <FormControl className='bg-transparent border-none'>
                                    <Textarea
                                        {...field}
                                        placeholder='Write your post here...'
                                        className='outline-none no-focus text-dark-1'
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    {
                                        enableImage ?
                                            <FileUploader fieldChange={field.onChange} mediaUrl={""} setIsFileUploaded={setIsFileUploaded} />
                                            :
                                            <Button onClick={() => setEnableImage(true)}>
                                                <Image size={25} />
                                            </Button>
                                    }
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type='submit' className='gap-4 comment-form_btn'>
                        {isPending ? <Loader className='animate-spin' /> : <><Send /> Send</>}
                    </Button>
                </form>
            </Form>

        </Modal>
    )
}

export default CreatePostModal
