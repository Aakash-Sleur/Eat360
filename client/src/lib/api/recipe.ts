
import { instance } from "../config";
import {
  FilterOptions,
  ICreatedRecipe,
  INewComment,
  IRecipe,
  IUpdatedRecipe,
} from "../types";

async function getRecipes(
  pageNumber: number = 1,
  pageSize: number
): Promise<IRecipe[] | undefined> {
  try {
    const response = await instance.get(`/recipes`, {
      params: {
        pageNumber,
        pageSize,
      },
    });
    return response.data as IRecipe[];
  } catch (error) {
    console.error(error);
  }
}

async function getUserRecipes(id: string): Promise<IRecipe[]| undefined> {
  try {
    const response = await instance.get(`/recipes/user/${id}`);
    return response.data as IRecipe[];
  } catch (error) {
    console.error(error);
  }
}


async function getRecipeById(id: string): Promise<IRecipe | undefined> {
  try {
    const response = await instance.get(
      `/recipes/${id}`
    );
    return response.data as IRecipe;
  } catch (error) {
    console.error(error);
  }
}

async function getTopRecipes() {
  try {
    const response = await instance.get(
      `/recipes/top`
    );
    return response.data as IRecipe[];
  } catch (error) {
    console.error(`[ERROR_GET_TOP_RECIPES]: ${error}`);
  }
}

async function createRecipe(
  recipe: ICreatedRecipe
): Promise<IRecipe | undefined> {
  try {
    const response = await instance.post(`/recipes`, {
      ...recipe,
    });

    if (!response) {
      throw new Error("Error creating recipe");
    }
    return response.data as IRecipe;
  } catch (error) {
    console.error(`Error creating recipe: ${error}`);
  }
}

async function updateRecipe(
  updatedRecipe: IUpdatedRecipe
): Promise<IRecipe | undefined> {
  try {
    const { _id, ...data } = updatedRecipe;
    const response = await instance.put(
      `/recipes/${_id}`,
      data
    );

    if (!response) {
      throw new Error("Error updating recipe");
    }

    return response.data as IRecipe;
  } catch (error) {
    console.log(`Error updating recipe: ${error}`);
  }
}

async function searchRecipe(searchTerm: string, filters: FilterOptions) {
  try {
    const response = await instance.get(
      `/recipes/search`,
      {
        params: {
          term: searchTerm,
          tags: filters.tags,
          isPremium: filters.isPremium,
          sortBy: filters.sortBy,
        },
      }
    );

    return response.data as IRecipe[];
  } catch (error) {
    console.error(error);
  }
}
async function deleteRecipe(id: string): Promise<void> {
  try {
    await instance.delete(`/recipes/${id}`);
  } catch (error) {
    console.error(`Error deleting recipe: ${error}`);
  }
}

async function createRecipeComment(comment: INewComment) {
  try {
    const newComment = await instance.post(
      `/recipes/${comment.id}/comments`,
      comment
    );

    if (!newComment) {
      throw new Error("Failed to create");
    }
    return newComment.data as IRecipe;
  } catch (error) {
    console.error(error);
  }
}

export {
  getRecipes,
  getRecipeById,
  getTopRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipe,
  createRecipeComment,
  getUserRecipes
};
