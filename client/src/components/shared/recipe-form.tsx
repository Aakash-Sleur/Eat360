import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { RecipeValidation } from '@/lib/validations';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import FileUploader from "@/components/shared/file-uploader";
import Editor from '@/components/shared/editor';
import { useUserContext } from '@/context/auth-store';
import { ICreatedRecipe, IRecipe } from '@/lib/types';
import { uploadImage } from '@/lib/api/upload';
import { useToast } from '@/components/ui/use-toast';
import { useCreateRecipeMutation, useUpdateRecipe } from '@/lib/react-query/queries-and-mutations';
import Loader from '@/components/loader';
import { Switch } from '../ui/switch';

type RecipeFormProps = {
    recipe?: IRecipe;
    actions: 'create' | 'update';
}

const RecipeForm = ({ recipe, actions }: RecipeFormProps) => {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { toast } = useToast();
    const { mutateAsync: createRecipe, isPending: isRecipePending } = useCreateRecipeMutation();
    const { mutateAsync: updatePost, isPending: isUpdatePending } = useUpdateRecipe();
    const [isFileUploaded, setIsFileUploaded] = useState(false);

    const formMethods = useForm<z.infer<typeof RecipeValidation>>({
        resolver: zodResolver(RecipeValidation),
        defaultValues: {
            title: recipe ? recipe.title : '',
            description: recipe ? recipe.description : '',
            file: [],
            ingredients: recipe ? recipe.ingredients : [{ name: '', quantity: '' }],
            instructions: recipe ? recipe.instructions : '',
            tags: recipe ? recipe.tags.join(',') : '',
            isPublic: recipe ? recipe.isPublic : true,
            isPremium: recipe ? recipe.isPremium : false,
            price: recipe ? recipe?.price.toString() : '0'
        }
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch
    } = formMethods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ingredients',
    });

    const isPremium = watch('isPremium')

    const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
            append({ name: '', quantity: '' })
        }

    }

    const onSubmit = async (data: z.infer<typeof RecipeValidation>) => {
        try {
            const tags = data.tags?.replace(/ /g, "").split(",") || [];
            const { file, ...revised_data } = data;

            const result_data: ICreatedRecipe = {
                ...revised_data,
                createdBy: user?._id,
                tags: tags
            }

            if (isFileUploaded && data.file.length > 0) {
                const uploadedImageUrl = await uploadImage(data.file[0]);

                if (!uploadedImageUrl) {
                    toast({ title: 'Failed to upload image' });
                    throw new Error('Failed to upload image');
                }

                result_data.banner_image = uploadedImageUrl;
            }

            if (recipe && actions === 'update') {
                const updatedPost = await updatePost({
                    _id: recipe._id,
                    ...result_data
                })

                if (!updatedPost) {
                    toast({ title: 'Failed to update recipe' });
                    throw new Error;
                }

                navigate(`/recipes/${recipe._id}`);
                toast({ title: 'Recipe updated successfully' });
                return;
            }

            const createdRecipe = await createRecipe(result_data);

            if (!createdRecipe) {
                toast({ title: 'Failed to create recipe' });
                throw new Error('Failed to create recipe');
            }

            navigate(`/recipes/${createdRecipe._id}`);
            toast({ title: 'Recipe created successfully' });
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to create recipe" });
        }
    };

    return (
        <Form {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-5xl gap-9">
                <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Title</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage>{errors.title?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Description</FormLabel>
                            <FormControl>
                                <Textarea className="shad-textarea custom-scrollbar" {...field} />
                            </FormControl>
                            <FormMessage>{errors.description?.message}</FormMessage>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Banner Image</FormLabel>
                            <FormControl>
                                <FileUploader fieldChange={field.onChange} mediaUrl={recipe?.banner_image || ""} setIsFileUploaded={setIsFileUploaded} />
                            </FormControl>
                            <FormMessage>{errors.file?.message}</FormMessage>
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel className="shad-form_label">Ingredients</FormLabel>
                    <div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex my-4 gap-x-4">
                                <Controller
                                    name={`ingredients.${index}.name`}
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input
                                                className='shad-input'
                                                type="text"
                                                placeholder="Item"
                                                {...field}
                                                onKeyDown={(event) => keyDown(event)}
                                            />
                                        </FormControl>
                                    )}
                                />
                                <FormMessage>{errors.ingredients?.[index]?.name?.message}</FormMessage>

                                <Controller
                                    name={`ingredients.${index}.quantity`}
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input
                                                className='shad-input'
                                                type="text"
                                                {...field}
                                                onKeyDown={(event) => keyDown(event)}
                                                placeholder="Quantity"
                                            />
                                        </FormControl>
                                    )}
                                />
                                <FormMessage>{errors.ingredients?.[index]?.quantity?.message}</FormMessage>

                                <Button type="button" className='text-white bg-red' onClick={() => remove(index)}>Remove</Button>
                            </div>
                        ))}
                        <Button type="button" className='text-white bg-green-600' onClick={() => append({ name: '', quantity: '' })}>Add Ingredient</Button>

                    </div>
                </FormItem>

                <FormField
                    control={control}
                    name="instructions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Instructions</FormLabel>
                            <FormControl>
                                <Editor onChange={field.onChange} value={field.value} />
                            </FormControl>
                            <FormMessage>{errors.instructions?.message}</FormMessage>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="isPublic"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-2'>
                            <FormLabel className="shad-form_label">Visibility</FormLabel>
                            <div className="flex items-center justify-between gap-2 space-y-0.5">
                                <FormDescription>
                                    Change the visibility of your recipe
                                </FormDescription>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="isPremium"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-2'>
                            <FormLabel className="shad-form_label">Premium</FormLabel>
                            <div className="flex items-center justify-between gap-2 space-y-0.5">
                                <FormDescription>
                                    Change the accessability
                                </FormDescription>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </div>
                        </FormItem>
                    )}
                />

                {
                    isPremium && (
                        <FormField
                            control={control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            placeholder="Price"
                                            className="shad-input"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )
                }

                <FormField
                    control={control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Tags (separated by comma ", ")</FormLabel>
                            <FormControl>
                                <Input type="text" className='shad-input' placeholder="Enter tags" {...field} />
                            </FormControl>
                            <FormMessage>{errors.tags?.message}</FormMessage>
                        </FormItem>
                    )}
                />



                <div className="flex items-center justify-end gap-4">
                    <Button type="button" className="shad-button_dark_4" onClick={() => navigate(-1)} disabled={isRecipePending || isUpdatePending}>Cancel</Button>
                    <Button type="submit" className="shad-button_primary whitespace-nowrap">
                        {isRecipePending || isUpdatePending ? <Loader /> : (actions === 'update' ? 'Update Recipe' : 'Create Recipe')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default RecipeForm;
