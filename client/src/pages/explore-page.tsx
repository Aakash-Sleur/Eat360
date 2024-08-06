import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";

import GridList from "@/components/shared/grid-recipelist";
import SearchResults from "@/components/shared/search-results";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/common-hooks/hooks";
import Loader from "@/components/loader"
import { useGetRecipes, useSearchRecipe } from "@/lib/react-query/queries-and-mutations";

const ExplorePage = () => {
    const { ref, inView } = useInView();
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || "";

    const [searchValue, setSearchValue] = useState(initialCategory);
    const { data: recipes, fetchNextPage, hasNextPage } = useGetRecipes();

    const shouldShowSearchResults = searchValue !== "";
    const debouncedSearch = useDebounce(searchValue, 500);
    const { data: searchedRecipes, isFetching: isSearchFetching } = useSearchRecipe(debouncedSearch);

    useEffect(() => {
        if (inView && !searchValue)
            fetchNextPage();
    }, [inView, searchValue])

    const shouldShowPosts = !shouldShowSearchResults &&
        recipes?.pages.every((item) => item?.length === 0);

    if (!recipes) return <Loader />

    return (
        <section className="explore-container">
            <div className="explore-inner_container">
                <h2 className="w-full text-dark-1 h3-bold md:h2-bold">Search Post</h2>
                <div className="flex w-full gap-1 px-4 border-4 rounded-lg bg-light-1 border-light-4">
                    <img
                        src="/icons/search.svg"
                        alt="search"
                        width={24}
                        height={24}
                    />
                    <Input
                        type="text"
                        placeholder="Search"
                        className="explore-search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-wrap w-full max-w-5xl mt-8 gap-9">
                {
                    shouldShowSearchResults ? (
                        <SearchResults
                            isSearchFetching={isSearchFetching}
                            searchRecipes={searchedRecipes}
                        />
                    ) : shouldShowPosts ? (
                        <p className="w-full mt-10 text-center text-light-4">
                            End of posts
                        </p>
                    ) : (
                        recipes?.pages.map((recipe, index) => (
                            <GridList key={`page-${index}`} recipes={recipe} />
                        ))
                    )
                }
            </div>

            {hasNextPage && !searchValue && (
                <div ref={ref} className="mt-10">
                    <Loader />
                </div>
            )}
        </section>
    )
}

export default ExplorePage
