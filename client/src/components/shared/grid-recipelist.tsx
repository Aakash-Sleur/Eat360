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
        <ul className="grid-container">
            {
                recipes
                    ?.filter(recipe => recipe.isPublic === true)
                    ?.map((recipe) => (
                        <li key={recipe._id} className="relative min-w-80 h-80">
                            <Suspense fallback={<Skeleton className="min-w-80 h-80" />} >
                                <RecipeCard recipe={recipe} />
                            </Suspense>
                        </li>
                    ))
            }
        </ul>
    )
}

export default GridList;