import ProfileRecipeCard from "./profile-recipe-card"

const UserRecipeGrid = ({ recipes }: {
    recipes: string[]
}) => {
    return (
        <ul className="grid-container">
            {recipes
                .map((recipe: string) => (
                    <ProfileRecipeCard recipeId={recipe} key={recipe} />
                ))}
        </ul>
    )
}

export default UserRecipeGrid