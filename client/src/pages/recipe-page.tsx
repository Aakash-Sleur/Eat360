import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, Users, Lock } from 'lucide-react'

import { instance } from '@/lib/config'
import { useUserContext } from "@/context/auth-store"
import { IRecipeComment } from '@/lib/types'
import { checkIfExist, getAdjustedIngredients, getRandomColor, getRelativeTime } from '@/lib/utils'
import { useGetRecipeById } from '@/lib/react-query/queries-and-mutations'
import Loader from '@/components/loader'
import Comment from '@/components/shared/comment'
import Stats from '@/components/shared/stats'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import CustomImage from '@/components/shared/custom-image'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function RecipePage() {
    const { id } = useParams()
    const [checkoutUrl, setCheckoutUrl] = useState(null)
    const { data: recipe, isLoading } = useGetRecipeById(id || "")
    const navigate = useNavigate()
    const { user: { _id: currentUserId } } = useUserContext()
    const [numPeople, setNumPeople] = useState<number>(1)

    const handleNumPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10)
        setNumPeople(Math.max(1, value))
    }

    useEffect(() => {
        if (checkoutUrl) {
            window.location.href = checkoutUrl
        }
    }, [checkoutUrl])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader />
            </div>
        )
    }

    if (!recipe) {
        return (
            <div className="flex items-center justify-center h-screen text-lg text-gray-500">
                No recipe found.
            </div>
        )
    }

    const handleCheckout = async () => {
        try {
            const response = await axios.post(`${instance.defaults.baseURL}/create-payment-intent`, {
                name: recipe.title,
                description: recipe.description,
                recipe_price: recipe.price,
                userId: currentUserId,
                recipeId: recipe._id,
            })

            const { url } = response.data
            setCheckoutUrl(url)
        } catch (error) {
            console.error('Error creating checkout session', error)
        }
    }

    const adjustedIngredients = getAdjustedIngredients(recipe, numPeople)
    const date = new Date(recipe.createdAt)

    return (
        <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container max-w-4xl px-4 py-8 mx-auto space-y-8"
        >
            {/* Recipe Header */}
            <motion.header
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="overflow-hidden bg-white shadow-lg rounded-2xl"
            >
                <div className="relative h-[400px]">
                    <CustomImage
                        src={recipe.banner_image}
                        alt={recipe.title}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 w-full p-6 text-white">
                        <h1 className="mb-2 text-4xl font-bold">{recipe.title}</h1>
                        <div className="flex flex-wrap gap-2">
                            {recipe.tags.map((tag: string, index: number) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className={`cursor-pointer ${getRandomColor()} bg-white/70`}
                                    onClick={() => navigate(`/explore?category=${tag}`)}
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <Stats authorId={recipe.createdBy} recipe={recipe} />
                        <time className="text-sm text-gray-500">
                            {date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    </div>
                    <p className="text-lg text-gray-700">{recipe.description}</p>
                </div>
            </motion.header>

            <Separator className="my-8" />

            {/* Premium Content Gate */}
            {recipe.isPremium && !checkIfExist(recipe.boughtBy, currentUserId) && recipe.createdBy !== currentUserId ? (
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="p-8 text-center shadow-lg rounded-xl bg-gradient-to-r from-orange-100 to-orange-200"
                >
                    <Lock className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">Premium Recipe</h2>
                    <p className="mb-6 text-lg text-gray-700">
                        Unlock this delicious recipe for ₹{recipe.price}
                    </p>
                    <Button
                        variant="link"
                        onClick={handleCheckout}
                        className="text-lg text-white bg-orange-600 hover:bg-orange-700"
                    >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Purchase Recipe
                    </Button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Ingredients Section */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Ingredients</h2>
                                <div className="flex items-center gap-4">
                                    <Users className="w-5 h-5 text-gray-500" />
                                    <Input
                                        type="number"
                                        value={numPeople}
                                        onChange={handleNumPeopleChange}
                                        className="w-20"
                                        min="1"
                                    />
                                    <span className="text-sm text-gray-500">servings</span>
                                </div>
                            </div>
                            <ul className="grid gap-3 md:grid-cols-2">
                                {adjustedIngredients.map((ingredient, index) => (
                                    <li key={index} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                                        <span className="font-medium">{ingredient.quantity}</span>
                                        <span className="text-gray-600">{ingredient.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Instructions Section */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="mb-6 text-2xl font-bold">Instructions</h2>
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: recipe.instructions || "" }}
                            />
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="mb-6 text-2xl font-bold">
                                Comments ({recipe.comments.length})
                            </h2>
                            <Comment recipeId={recipe._id} />
                            <div className="mt-6 space-y-4">
                                {recipe.comments.map((comment: IRecipeComment) => (
                                    <motion.div
                                        key={comment._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-lg bg-gray-50"
                                    >
                                        <div className="flex items-start gap-4">
                                            <Link to={`/profile/${comment.author._id}`}>
                                                <Avatar>
                                                    <AvatarImage
                                                        src={comment.author.profilePicture || "/icons/profile-placeholder.svg"}
                                                        alt={comment.author.username}
                                                    />
                                                    <AvatarFallback>{comment.author.username[0]}</AvatarFallback>
                                                </Avatar>
                                            </Link>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold">{comment.author.username}</h3>
                                                    <time className="text-sm text-gray-500">
                                                        {getRelativeTime(comment.createdAt.toString())}
                                                    </time>
                                                </div>
                                                <p className="text-gray-700">{comment.text}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.article>
    )
}