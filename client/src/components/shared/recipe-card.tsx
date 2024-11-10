'use client'

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Heart, MessageCircle } from "lucide-react"

import { IRecipe } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetUserById } from "@/lib/react-query/queries-and-mutations"
import CustomImage from "./custom-image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type RecipeCardProps = {
    recipe: IRecipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const { data: author, isLoading: isAuthorLoading } = useGetUserById(recipe.createdBy || "")

    if (isAuthorLoading || !author) {
        return (
            <Card className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Link to={`/recipes/${recipe._id}`}>
                <Card className="group overflow-hidden">
                    <div className="relative aspect-square">
                        <CustomImage
                            src={recipe.banner_image}
                            alt={recipe.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Overlay with recipe details */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="absolute bottom-0 w-full p-4">
                                <div className="flex items-center justify-between text-white">
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-4 w-4" />
                                        <span className="text-sm">{recipe.likes || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        <span className="text-sm">{recipe.comments?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="line-clamp-1 text-lg font-semibold">{recipe.title}</h3>
                            {recipe.tags && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                    {recipe.tags[0]}
                                </Badge>
                            )}
                        </div>

                        {recipe.description && (
                            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                                {recipe.description}
                            </p>
                        )}

                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage
                                    src={author.profilePicture || "/assets/icons/profile-placeholder.svg"}
                                    alt={author.name}
                                />
                                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">{author.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(recipe.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    )
}