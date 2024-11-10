import axios from "axios";

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
    const response = await axios.get(`${instance.defaults.baseURL}/recipes`, {
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

async function getRecipeById(id: string): Promise<IRecipe | undefined> {
  try {
    const response = await axios.get(
      `${instance.defaults.baseURL}/recipes/${id}`
    );
    return response.data as IRecipe;
  } catch (error) {
    console.error(error);
  }
}

async function getTopRecipes() {
  try {
    const response = await axios.get(
      `${instance.defaults.baseURL}/recipes/top`
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
    const response = await axios.post(`${instance.defaults.baseURL}/recipes`, {
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
    const response = await axios.put(
      `${instance.defaults.baseURL}/recipes/${_id}`,
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
    const response = await axios.get(
      `${instance.defaults.baseURL}/recipes/search`,
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
    await axios.delete(`${instance.defaults.baseURL}/recipes/${id}`);
  } catch (error) {
    console.error(`Error deleting recipe: ${error}`);
  }
}

async function createRecipeComment(comment: INewComment) {
  try {
    const newComment = await axios.post(
      `${instance.defaults.baseURL}/recipes/${comment.id}/comments`,
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
};
