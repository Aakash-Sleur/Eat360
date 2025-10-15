import { IRecipe } from "@/lib/types"
import ProfileRecipeCard from "./profile-recipe-card"

const UserRecipeGrid = ({ recipes }: {
    recipes: IRecipe[]
}) => {
    return (
        <ul className="grid-container">
            {recipes
                .map((recipe) => (
                    <ProfileRecipeCard recipe={recipe} key={recipe._id} />
                ))}
        </ul>
    )
}

export default UserRecipeGrid