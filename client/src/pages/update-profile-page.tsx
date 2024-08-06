
import { z } from 'zod';
import { useForm } from 'react-hook-form';

import Loader from '@/components/loader';
import { useUserContext } from '@/context/auth-store';
import { ProfileValidation } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '@/components/shared/image-uploader';
import { useUpdateUser } from '@/lib/react-query/queries-and-mutations';
import { useState } from 'react';
import { uploadImage } from '@/lib/api/upload';
import { IUpdateProfile } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { setUserCredentials } from '@/lib/utils';

const UpdateProfilePage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUserContext();
    const { toast } = useToast();
    const [isFileUploaded, setIsFileUploaded] = useState(false);

    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateUser();

    const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        defaultValues: {
            file: [],
            name: user.name,
            username: user.username,
            bio: user.bio || ""
        }
    })

    if (!user) {
        return (
            <Loader />
        )
    }
    const handleUpdate = async (values: z.infer<typeof ProfileValidation>) => {
        try {
            const result: IUpdateProfile = {
                id: user._id,
                username: values.username,
                name: values.name,
                bio: values.bio,
            };

            if (isFileUploaded) {
                const uploadedImageUrl = await uploadImage(values.file[0]);

                if (!uploadedImageUrl) {
                    throw new Error('Image upload failed');
                }

                result.profilePicture = uploadedImageUrl;
            }

            const updatedUser = await updateProfile(result);

            if (!updatedUser) {
                throw new Error('Update failed, user not returned');
            }

            setUserCredentials(updatedUser);
            setUser(updatedUser);
            navigate(`/profile/${user._id}`);
            toast({ title: "Profile updated successfully." });
        } catch (error) {
            console.log(error);
            toast({ title: "Update failed. Please try again." });
        }
    };


    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="justify-start w-full max-w-5xl gap-3 flex-start">
                    <img
                        src="/icons/edit.svg"
                        width={36}
                        height={36}
                        alt="edit"
                        className="invert-white"
                    />
                    <h2 className="w-full text-left h3-bold md:h2-bold">Edit Profile</h2>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleUpdate)}
                        className="flex flex-col w-full max-w-5xl mt-4 gap-7"
                    >
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <ImageUploader
                                    fieldChange={field.onChange}
                                    mediaUrl={user.profilePicture || ""}
                                    setIsFileUploaded={setIsFileUploaded}
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="shad-input"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="shad-input"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="shad-textarea custom-scrollbar"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-end gap-4">
                            <Button
                                type="button"
                                className="shad-button_dark_4"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="shad-button_primary whitespace-nowrap"
                                disabled={isUpdatingProfile}
                            >
                                {
                                    isUpdatingProfile
                                        ? <Loader />
                                        : "Update Profile"
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )

}

export default UpdateProfilePage;
