import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import Loader from "../components/loader"
import GridList from "@/components/shared/grid-recipelist";
import { useGetRecipes } from "@/lib/react-query/queries-and-mutations"



const AllRecipes = () => {
    const { ref, inView } = useInView();
    const { data: recipes, fetchNextPage, hasNextPage } = useGetRecipes();

    useEffect(() => {
        if (inView) fetchNextPage();
    }, [inView])

    if (!recipes) return <Loader />;

    return (
        <section className="general-container">
            <div className="flex items-center justify-between w-full">
                <h2 className="text-left h3-bold md:h2-bold">Recipes</h2>
                <Link to="/create-recipe">
                    <img src="/icons/create.svg" alt="add-post" className="size-10" />
                </Link>
            </div>
            <ul className="w-full">
                {
                    recipes.pages?.map((page, idx) => (
                        <React.Fragment key={idx}>
                            {
                                <GridList recipes={page} />
                            }
                        </React.Fragment>
                    ))
                }
            </ul>
            {hasNextPage && (
                <div ref={ref} className="mt-10">
                    <Loader />
                </div>
            )}
        </section>
    )
}

export default AllRecipes
