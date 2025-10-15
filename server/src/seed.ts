import Recipe from "./models/recipe.model";

export const addPublish = async () => {
    try {
        await Recipe.updateMany({ published: { $exists: false } }, { published: true });
    } catch (error) {
        console.error(error)
    }
}