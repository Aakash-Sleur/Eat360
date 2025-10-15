import { useState } from 'react'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Image, Loader, Send } from 'lucide-react'

import { Modal } from '@/components/ui/modal'
import { useCreatePostModal } from '@/hooks/modal-hooks'
import { PostValidation } from "@/lib/validations"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea'
import { useCreatePost } from '@/lib/react-query/queries-and-mutations'
import { useUserContext } from '@/context/auth-store'
import { uploadImage } from '@/lib/api/upload'
import { ICreatePost } from '@/lib/types'
import FileUploader from '@/components/shared/file-uploader'

export default function CreatePostModal() {
    const { isOpen, onClose } = useCreatePostModal()
    const [enableImage, setEnableImage] = useState(false)
    const [isFileUploaded, setIsFileUploaded] = useState(false)
    const { mutateAsync: createPost, isPending } = useCreatePost()
    const { user } = useUserContext()

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
            author: user._id
        }

        if (isFileUploaded) {
            const image = await uploadImage(values.file[0])
            data.image = image
        }

        await createPost(data)
        handleClose()
    }

    const handleClose = () => {
        onClose()
        form.reset()
        setEnableImage(false)
        setIsFileUploaded(false)
    }

    return (
        <Modal
            title='Create Post'
            description='Share your thoughts with the world'
            isOpen={isOpen}
            onClose={handleClose}
            styles='w-full max-w-md h-fit sm:max-w-lg overflow-y-scroll'
        >
            <Form {...form}>
                <form
                    className="flex flex-col gap-4 overflow-scroll"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name='text'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Post content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder='Write your post here...'
                                        className='min-h-[100px] resize-none bg-background'
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem className=''>
                                <FormControl>
                                    {enableImage ? (
                                        <FileUploader
                                            fieldChange={field.onChange}
                                            mediaUrl=""
                                            setIsFileUploaded={setIsFileUploaded}
                                        />
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setEnableImage(true)}
                                            className="w-full"
                                        >
                                            <Image className="w-4 h-4 mr-2" />
                                            Add Image
                                        </Button>
                                    )}
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type='submit' className='w-full' disabled={isPending}>
                        {isPending ? (
                            <Loader className='w-4 h-4 mr-2 animate-spin' />
                        ) : (
                            <Send className='w-4 h-4 mr-2' />
                        )}
                        {isPending ? 'Posting...' : 'Post'}
                    </Button>
                </form>
            </Form>
        </Modal>
    )
}