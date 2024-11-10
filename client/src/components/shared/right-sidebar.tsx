'use client'

import { useState } from 'react'
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { useGetTopRecipes } from "@/lib/react-query/queries-and-mutations"
import CustomImage from "./custom-image"
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

const RightSidebar = () => {
    const { data: recipes, isLoading } = useGetTopRecipes()
    const [isOpen, setIsOpen] = useState(true)

    return (
        <Sidebar className="border-l border-orange-200/80" side="right">
            <SidebarContent className="p-4 w-96 bg-orange-50/50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-orange-800">Top Recipes</h2>
                    <SidebarTrigger>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </Button>
                    </SidebarTrigger>
                </div>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    <div className="space-y-4">
                        {isLoading && (
                            Array(5).fill(0).map((_, index) => (
                                <div key={index} className="space-y-2">
                                    <Skeleton className="w-full h-48 rounded-xl" />
                                    <Skeleton className="w-3/4 h-4" />
                                </div>
                            ))
                        )}
                        {recipes?.map((recipe) => (
                            <Link
                                to={`/recipes/${recipe._id}`}
                                key={recipe._id}
                                className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-xl"
                            >
                                <article className="relative h-48 overflow-hidden shadow-md rounded-xl">
                                    <CustomImage
                                        src={recipe.banner_image}
                                        alt={recipe.title}
                                        className="object-cover w-full h-full transition-transform hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-0 w-full p-3">
                                        <h3 className="text-lg font-semibold text-white line-clamp-2">{recipe.title}</h3>

                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </ScrollArea>
            </SidebarContent>
        </Sidebar>
    )
}

export default RightSidebar