import { useState, useEffect, Key } from 'react'
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { instance } from '@/lib/config';
import { useUserContext } from "@/context/auth-store";
import { IRecipeComment } from '@/lib/types';
import { checkIfExist, getAdjustedIngredients, getRandomColor, getRelativeTime } from '@/lib/utils';
import { useGetRecipeById } from '@/lib/react-query/queries-and-mutations';
import Loader from '@/components/loader';
import Comment from '@/components/shared/comment';
import Stats from '@/components/shared/stats';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CustomImage from '@/components/shared/custom-image';


const RecipePage = () => {
    const { id } = useParams();
    const [checkoutUrl, setCheckoutUrl] = useState(null);
    const { data: recipe, isLoading } = useGetRecipeById(id || "");
    const navigate = useNavigate();
    const { user: {
        _id: currentUserId
    } } = useUserContext();

    const [numPeople, setNumPeople] = useState<number>(1);

    const handleNumPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setNumPeople(value); // Ensure numPeople is always at least 1
    };


    useEffect(() => {
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        }
    }, [checkoutUrl])

    if (isLoading) {
        return <Loader />;
    }

    if (!recipe) {
        return <div>No recipe found.</div>;
    }


    const handleCheckout = async () => {
        try {
            const response = await axios.post(`${instance.defaults.baseURL}/create-payment-intent`, {
                name: recipe.title,
                description: recipe.description,
                recipe_price: recipe.price,
                userId: currentUserId,
                recipeId: recipe._id,
            });

            const { url } = response.data;
            setCheckoutUrl(url);
        } catch (error) {
            console.error('Error creating checkout session', error);
        }
    };

    const adjustedIngredients = getAdjustedIngredients(recipe, numPeople);

    const date = new Date(recipe.createdAt);

    return (
        <article className='w-full bg-[#f9fafb] p-5 mx-auto space-y-8 overflow-scroll custom-scrollbar'>
            <header className='p-8 space-y-6 text-center bg-white rounded-md shadow-md'>
                <h1 className='text-5xl font-extrabold underline font-poppins'>{recipe.title}</h1>
                <p className='text-sm text-left'>Last updated: {date.toDateString()}</p>
                <p className='p-4 text-lg italic prose-lg text-left rounded-md shadow-sm font-poppins text-dark-1'>
                    {recipe.description}
                </p>
                <div className="flex flex-wrap gap-x-3">
                    {recipe.tags.map((tag: string, index: Key) => (
                        <Button
                            onClick={() => navigate(`/explore?category=${tag}`)}
                            key={index}
                            className={getRandomColor()}
                        >
                            #{tag}
                        </Button>
                    ))}
                </div>
                <Stats authorId={recipe.createdBy} recipe={recipe} />
                <CustomImage
                    src={recipe.banner_image}
                    alt="Recipe banner"
                    className='w-full max-w-5xl mx-auto my-5 rounded-lg shadow-lg max-h-[600px] object-cover'
                />
            </header>
            <Separator />
            {recipe.isPremium && !checkIfExist(recipe.boughtBy, currentUserId) && recipe.createdBy !== currentUserId ? (
                <div className="w-full mx-auto space-y-4 text-center">
                    <p className="text-xl font-semibold text-gray-800">
                        Purchase the recipe to access this delicacy for ₹{recipe.price}
                    </p>
                    <Button onClick={handleCheckout} variant="destructive" className="px-8 text-lg text-white bg-yellow-500 animate-pulse hover:animate-none">
                        Buy
                    </Button>
                </div>
            ) : (
                <>
                    <section className='space-y-3 prose'>
                        <h2 className='text-2xl font-bold'>Ingredients</h2>
                        <label className='block text-lg'>
                            Number of People:
                            <input
                                type='number'
                                value={numPeople}
                                onChange={handleNumPeopleChange}
                                className='p-1 ml-2 border rounded shad-input'
                                min='1'
                            />
                        </label>
                        <ul className='space-y-2 text-lg list-disc marker:text-dark-1 prose-ul'>
                            {adjustedIngredients.map((ingredient, index) => (
                                <li key={index} className='text-lg'>
                                    <span className='font-semibold font-poppins'>{ingredient.quantity}</span> - {ingredient.name}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <Separator />
                    <section className='space-y-3 prose'>
                        <h2 className='text-2xl font-bold'>Instructions</h2>
                        <div
                            className='prose'
                            dangerouslySetInnerHTML={{ __html: recipe.instructions || "" }}
                        />
                    </section>
                    <Separator className='h-1 rounded-sm bg-light-3' />
                    <section className='w-full mx-auto space-y-3'>
                        <h2 className='text-2xl font-bold'>Comments ({recipe.comments.length})</h2>
                        <Comment recipeId={recipe._id} />
                        <div className="space-y-4">
                            {recipe.comments.map((comment: IRecipeComment) => {
                                const createdAt = getRelativeTime(comment.createdAt.toString());
                                return (
                                    <article key={comment._id} className='flex w-full p-4 bg-white rounded-md shadow-sm'>
                                        <Link to={`/profile/${comment.author._id}`}>
                                            <img
                                                src={comment.author.profilePicture || "/icons/profile-placeholder.svg"}
                                                alt="author-profile-picture"
                                                className="w-10 h-10 rounded-full"
                                            />
                                        </Link>
                                        <div className="flex flex-col ml-4">
                                            <div className="flex items-center gap-x-4">
                                                <h3 className="font-semibold">{comment.author.username}</h3>
                                                <time className="text-light-4">{createdAt}</time>
                                            </div>
                                            <p className="p-3 bg-gray-100 rounded-md">{comment.text}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                </>
            )}
        </article>
    );
}

export default RecipePage;
