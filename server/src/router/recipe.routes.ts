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
  getUserRecipes,
  updateRecipe,
} from "../controllers/recipe.controller";
import { requireAuth } from "../middleware/require-auth";

export default (router: Router) => {
  router
    .get("/recipes", requireAuth,  getAllRecipes)
    .get("/recipes/search", requireAuth,  getSearchRecipes)
    .get("/recipes/top", requireAuth,  getTopRecipes)
    .post("/recipes", requireAuth,  createRecipe)
    .get("/recipes/user/:id", requireAuth,  getUserRecipes)
    .get("/recipes/:id", requireAuth,  getRecipeById)
    .put("/recipes/:id", requireAuth,  updateRecipe)
    .delete("/recipes/:id", requireAuth,  deleteRecipe)
    .post("/recipes/:id/comments", requireAuth,  commentRecipe)
    .delete("/recipes/:id/comments", requireAuth,  deleteComment)

  return router;
};
