import { useParams } from "react-router-dom";

import Loader from "@/components/loader";
import RecipeForm from "@/components/shared/recipe-form"
import { useGetRecipeById } from "@/lib/react-query/queries-and-mutations"

const UpdateRecipePage = () => {
    const { id } = useParams()
    const { data: recipe, isLoading } = useGetRecipeById(id || "");

    if (isLoading) return <Loader />
    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="justify-start w-full gap-3 mx-auto md:max-w-5xl flex-start">
                    <img
                        src="/icons/add-post.svg"
                        width={36}
                        height={36}
                        alt="edit"
                    />
                    <h2 className="w-full text-left h3-bold md:h2-bold">Create Recipe</h2>
                </div>

                <RecipeForm actions='update' recipe={recipe} />
            </div>
        </div>
    )
}

export default UpdateRecipePage
