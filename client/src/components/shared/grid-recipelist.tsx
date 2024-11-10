import { lazy, Suspense } from "react";

import Loader from "../loader";
import { IRecipe } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
const RecipeCard = lazy(() => import("./recipe-card"));


type GridListProps = {
    recipes?: IRecipe[];
}

const GridList = ({ recipes }: GridListProps) => {
    if (!recipes) return <Loader />
    return (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {
                recipes
                    ?.filter(recipe => recipe.isPublic === true)
                    ?.map((recipe) => (
                        <li key={recipe._id} className="relative">
                            <Suspense fallback={<Skeleton className="h-80" />} >
                                <RecipeCard recipe={recipe} />
                            </Suspense>
                        </li>
                    ))
            }
        </ul>
    )
}

export default GridList;