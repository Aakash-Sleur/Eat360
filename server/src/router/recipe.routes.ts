import { Router } from "express";

import {
  commentRecipe,
  createRecipe,
  deleteComment,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  getSearchRecipes,
  getTopRecipes,
  updateRecipe,
} from "../controllers/recipe.controller";

export default (router: Router) => {
  router
    .get("/recipes", getAllRecipes)
    .get("/recipes/search", getSearchRecipes)
    .get("/recipes/top", getTopRecipes)
    .post("/recipes", createRecipe)
    .get("/recipes/:id", getRecipeById)
    .put("/recipes/:id", updateRecipe)
    .delete("/recipes/:id", deleteRecipe)
    .post("/recipes/:id/comments", commentRecipe)
    .delete("/recipes/:id/comments", deleteComment);

  return router;
};
