'use client'

import { useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Loader2, SlidersHorizontal } from "lucide-react"

import GridList from "@/components/shared/grid-recipelist"
import SearchResults from "@/components/shared/search-results"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/common-hooks/hooks"
import Loader from "@/components/loader"
import { useGetRecipes, useSearchRecipe } from "@/lib/react-query/queries-and-mutations"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import FilterSection from "@/components/shared/filter-section"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
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

interface FilterOptions {
    tags: string[]
    isPremium: boolean | null
    sortBy: string
}


export default function ExplorePage() {
    const { ref, inView } = useInView()
    const [searchParams] = useSearchParams()
    const initialCategory = searchParams.get('category') || ""

    const [searchValue, setSearchValue] = useState(initialCategory)
    const [filters, setFilters] = useState<FilterOptions>({
        tags: [],
        isPremium: null,
        sortBy: 'date_desc'
    })
    const { data: recipes, fetchNextPage, hasNextPage } = useGetRecipes()

    const shouldShowSearchResults = searchValue !== "" || filters.tags.length > 0 || filters.isPremium !== null
    const debouncedSearch = useDebounce(searchValue, 500)
    const debouncedFilters = useDebounce(filters, 500)
    const { data: searchedRecipes, isFetching: isSearchFetching } = useSearchRecipe(debouncedSearch, debouncedFilters);

    const uniqueTags = useMemo(() => {
        const allTags = new Set<string>();

        const recipesToIterate = searchedRecipes || recipes?.pages.flat() || [];

        recipesToIterate.forEach((recipe) => {
            recipe?.tags?.forEach((tag) => allTags.add(tag));
        });

        return Array.from(allTags);
    }, [searchedRecipes, recipes]);

    useEffect(() => {
        if (inView && !shouldShowSearchResults) {
            fetchNextPage()
        }
    }, [inView, shouldShowSearchResults, fetchNextPage])

    const shouldShowPosts = !shouldShowSearchResults &&
        recipes?.pages.every((item) => item?.length === 0)

    const handleClearSearch = () => {
        setSearchValue("")
        setFilters({
            tags: [],
            isPremium: null,
            sortBy: 'date_desc'
        })
    }

    return (
        <motion.section
            className="container px-4 py-8 mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Search Header */}
            <motion.div
                className="mb-12 space-y-6"
                variants={itemVariants}
            >
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Explore Recipes
                    </h1>
                    {shouldShowSearchResults && (
                        <Button
                            variant="ghost"
                            onClick={handleClearSearch}
                            className="text-orange-600 hover:text-orange-700"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>

                <div className="relative">
                    <div className="relative flex items-center bg-white border-2 border-orange-100 shadow-sm rounded-xl focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100">
                        <Search className="w-5 h-5 ml-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search for recipes, ingredients, or chefs..."
                            className="px-4 py-6 text-lg bg-transparent border-0 shadow-none outline-none focus-visible:ring-0"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        {isSearchFetching && (
                            <Loader2 className="w-5 h-5 mr-4 text-orange-500 animate-spin" />
                        )}
                    </div>

                    {shouldShowSearchResults && (
                        <motion.div
                            className="absolute w-full mt-2 text-sm text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            Showing filtered results
                        </motion.div>
                    )}
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Filters & Sort
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-white shadow-lg backdrop-blur-lg">
                        <SheetHeader>
                            <SheetTitle>Recipe Filters</SheetTitle>
                            <SheetDescription>
                                Adjust the filters to find your perfect recipe.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                            <FilterSection filters={filters} setFilters={setFilters} tags={uniqueTags} />
                        </div>
                    </SheetContent>
                </Sheet>
            </motion.div>

            {/* Results Section */}
            <AnimatePresence mode="wait">
                <motion.div
                    className="min-h-[200px]"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {shouldShowSearchResults ? (
                        <motion.div variants={itemVariants}>
                            <SearchResults
                                isSearchFetching={isSearchFetching}
                                searchRecipes={searchedRecipes}
                            />
                        </motion.div>
                    ) : shouldShowPosts ? (
                        <motion.p
                            className="mt-20 text-lg text-center text-gray-500"
                            variants={itemVariants}
                        >
                            No recipes found. Try different search terms or filters.
                        </motion.p>
                    ) : (
                        <motion.div
                            className=""
                            variants={containerVariants}
                        >
                            {recipes?.pages.map((recipe, index) => (
                                <motion.div key={`page-${index}`} variants={itemVariants}>
                                    <GridList recipes={recipe} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Infinite Scroll Loader */}
            {hasNextPage && !shouldShowSearchResults && (
                <motion.div
                    ref={ref}
                    className="flex justify-center mt-10"
                    variants={itemVariants}
                >
                    <Loader />
                </motion.div>
            )}
        </motion.section>
    )
}