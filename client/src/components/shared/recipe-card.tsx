import { Link } from "react-router-dom";

import { IRecipe } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useGetUserById } from "@/lib/react-query/queries-and-mutations";
import CustomImage from "./custom-image";

type RecipeCardProps = {
    recipe: IRecipe
}


const RecipeCard = ({ recipe }: RecipeCardProps) => {
    const { data: author } = useGetUserById(recipe.createdBy || "");

    if (!author) {
        return <Skeleton className="w-full h-full" />

    }

    return (
        <Link to={`/recipes/${recipe._id}`} className="grid-post_link">
            <CustomImage src={recipe.banner_image} alt="recipe" className="object-cover w-full h-full" />
            <div className="w-full p-2 grid-post_user bg-white/50">
                <CustomImage src={author.profilePicture || "/assets/icons/profile-placeholder.svg"} alt="author_profile" className="rounded-full size-10" />
                <div className="ml-2">
                    <p className="text-white"> {recipe.title} </p>
                    <p className="text-gray-300"> {author.name} </p>
                </div>

            </div>
        </Link>
    )
}

export default RecipeCard
