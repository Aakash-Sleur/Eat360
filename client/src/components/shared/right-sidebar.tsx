import { Link } from "react-router-dom"

import { useGetTopRecipes } from "@/lib/react-query/queries-and-mutations"
import CustomImage from "./custom-image";

const RightSidebar = () => {
    const { data: recipes } = useGetTopRecipes();

    return (
        <aside className="rightsidebar">
            <h2 className="text-xl font-bold">Top Recipes:</h2>
            <div className="flex flex-col gap-4 max-w-[500px]">
                {
                    recipes?.map((recipe) => (
                        <Link to={`/recipes/${recipe._id}`} key={recipe._id}>
                            <article className="relative h-64 overflow-hidden w-72 rounded-xl">
                                <CustomImage
                                    src={recipe.banner_image}
                                    alt="recipe"
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute bottom-0 w-full p-2 bg-black/50 text-light-1">
                                    {recipe.title}
                                </div>
                            </article>
                        </Link>
                    ))
                }
            </div>
        </aside>
    )
}

export default RightSidebar
