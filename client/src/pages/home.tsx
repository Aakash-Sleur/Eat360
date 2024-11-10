'use client'

import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ChefHat, Clock, Search, Users, Utensils } from "lucide-react"

import { categories } from "@/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CustomImage from "@/components/shared/custom-image"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetTopRecipes, useGetTopUsers } from "@/lib/react-query/queries-and-mutations"
import { useState } from "react"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
}

export default function Home() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: topRecipes } = useGetTopRecipes();
    const { data: topUsers } = useGetTopUsers();


    console.log(topUsers)

    return (
        <motion.section
            className="flex-1 overflow-y-auto custom-scrollbar"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container px-4 py-6 mx-auto space-y-16">
                {/* Hero Section with Search */}
                <motion.div
                    className="relative p-8 rounded-3xl bg-gradient-to-r from-orange-100 to-orange-200 md:p-12"
                    variants={itemVariants}
                >
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                            Discover & Share Amazing Recipes
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Join our community of food lovers and explore thousands of delicious recipes
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />
                                <Input
                                    placeholder="Search recipes..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={() => navigate(`/explore?category=${searchTerm}`)}
                                className="text-white bg-orange-600 hover:bg-orange-700"
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    className="grid grid-cols-2 gap-4 md:grid-cols-4"
                    variants={containerVariants}
                >
                    {[
                        { icon: Utensils, label: "Recipes", value: "10,000+" },
                        { icon: ChefHat, label: "Chefs", value: "1,000+" },
                        { icon: Users, label: "Users", value: "50,000+" },
                        { icon: Clock, label: "Cook Time Saved", value: "1M+ Hours" }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="p-4 text-center bg-white shadow-sm rounded-xl"
                        >
                            <stat.icon className="w-8 h-8 mx-auto text-orange-500" />
                            <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Featured Recipes */}
                <motion.div variants={containerVariants} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Featured Recipes</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {topRecipes?.map((recipe) => (
                            <motion.div
                                key={recipe._id}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <Card className="overflow-hidden cursor-pointer" onClick={() => navigate(`recipes/${recipe._id}`)} >
                                    <CustomImage
                                        src={recipe.banner_image}
                                        alt={recipe.title}
                                        className="object-cover w-full transition-transform duration-300 aspect-video group-hover:scale-105"
                                    />
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">{recipe.title}</h3>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-sm text-gray-600">By {recipe.createdBy?.username || ""}</span>
                                            <span className="text-sm text-orange-600">{recipe.likes} likes</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Categories Section (Existing) */}
                <motion.div className="space-y-6" variants={containerVariants}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            Explore Categories
                        </h2>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/explore')}
                            className="text-orange-600 hover:text-orange-700"
                        >
                            View All
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <motion.div
                                key={category.name}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="relative group"
                            >
                                <Button
                                    onClick={() => navigate(`/explore?category=${category.name}`)}
                                    className="relative w-full p-0 overflow-hidden h-72 rounded-2xl"
                                    variant="ghost"
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"
                                        initial={{ opacity: 0.6 }}
                                        whileHover={{ opacity: 0.8 }}
                                    />
                                    <CustomImage
                                        src={category.image}
                                        alt={category.name}
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute bottom-0 w-full p-6 text-left">
                                        <h3 className="text-xl font-bold text-white">{category.name}</h3>
                                    </div>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Chefs */}
                <motion.div variants={containerVariants} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Top Chefs to Follow</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {topUsers?.map((chef) => (
                            <motion.div
                                key={chef._id}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="cursor-pointer" onClick={() => navigate(`/profile/${chef._id}`)}>
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <Avatar className="w-16 h-16">
                                            <AvatarImage src={chef.profilePicture} alt={chef.username} />
                                            <AvatarFallback>{chef.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{chef.name}</h3>
                                            <p className="mt-1 text-sm text-orange-600">{chef.followers.length} followers</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Newsletter Section */}
                <motion.div
                    variants={itemVariants}
                    className="p-8 rounded-2xl bg-orange-50 md:p-12"
                >
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            Get Weekly Recipe Updates
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Subscribe to our newsletter and never miss out on delicious new recipes
                        </p>
                        <div className="flex flex-col items-center gap-4 mt-6 sm:flex-row sm:justify-center">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="max-w-xs"
                            />
                            <Button className="text-white bg-orange-600 hover:bg-orange-700">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}