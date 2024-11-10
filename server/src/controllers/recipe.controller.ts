import mongoose from "mongoose";
import { Request, Response } from "express";

import Recipe from "../models/recipe.model";
import User from "../models/user.model";
import Comment from "../models/comment.model";

export async function createRecipe(req: Request, res: Response) {
  try {
    const { title, ingredients, instructions, createdBy, tags, ...rest } =
      req.body;

    if (!title || !ingredients || !instructions || !createdBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const createdRecipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      createdBy,
      tags,
      ...rest,
    });

    if (!createdRecipe) {
      return res.status(500).json({ error: "Failed to create recipe" });
    }

    await User.findByIdAndUpdate(createdBy, {
      $push: { recipes: createdRecipe._id },
    });

    res.status(201).json(createdRecipe);
  } catch (error) {
    console.error(error.message);
    throw new Error(`Failed to create recipe: ${error.message}`);
  }
}

export async function getAllRecipes(req: Request, res: Response) {
  try {
    const pageNumber = parseInt(req.query.pageNumber?.toString()) || 1;
    const pageSize = parseInt(req.query.pageSize?.toString()) || 10;
    const skipAmount = (pageNumber - 1) * pageSize;

    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize);

    res.status(200).json(recipes);
  } catch (error) {
    console.error(error.message);
    throw new Error(`Failed to get all recipes: ${error.message}`);
  }
}

export async function getRecipeById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate({
      path: "comments",
      model: Comment,
      populate: {
        path: "author",
        select: "_id name username profilePicture",
        model: User,
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error(error.message);
    throw new Error(`Failed to get recipe: ${error.message}`);
  }
}

export async function getSearchRecipes(req: Request, res: Response) {
  const { term, tags, isPremium, sortBy } = req.query;

  try {
    let query: any = {};

    if (term) {
      const regex = new RegExp(term.toString(), "i");
      query.$or = [
        { title: regex },
        { ingredients: regex },
        { "instructions.name": regex },
        { tags: regex },
      ];
    }

    if (tags && Array.isArray(tags) && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (isPremium !== undefined) {
      query.isPremium = isPremium === "true";
    }

    let sort: any = {};
    switch (sortBy) {
      case "date_desc":
        sort = { createdAt: -1 };
        break;
      case "date_asc":
        sort = { createdAt: 1 };
        break;
      case "likes_desc":
        sort = { likes: -1 };
        break;
      case "views_desc":
        sort = { views: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const recipes = await Recipe.find(query).sort(sort).exec();

    return res.status(200).json(recipes);
  } catch (error) {
    console.log(`[GET_SEARCH_RECIPES]: ${error}`);
    return res.status(500).json({ error: "Failed to get recipes" });
  }
}

export async function updateRecipe(req: Request, res: Response) {
  const { ObjectId } = mongoose.Types;
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Check if the recipe exists
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Validate and filter the viewedBy field if it exists in the updated data
    if (updatedData.viewedBy && Array.isArray(updatedData.viewedBy)) {
      updatedData.viewedBy = updatedData.viewedBy.filter((item: string) =>
        ObjectId.isValid(item)
      );
    }

    // Update the recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedRecipe) {
      return res.status(500).json({ error: "Failed to update recipe" });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Failed to update recipe: ${error.message}` });
  }
}

export async function deleteRecipe(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const user = await User.findById(recipe.createdBy);

    if (!user) {
      return res.status(404).json({ error: "Author of the recipe not found" });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(500).json({ error: "Failed to delete recipe" });
    }

    await User.findByIdAndUpdate(user._id, {
      $pull: { recipes: id },
    });

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error.message);
    throw new Error(`Failed to delete recipe: ${error.message}`);
  }
}

export async function commentRecipe(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { author, text } = req.body;

    if (!id) {
      res.status(400).json({ error: "Recipe ID is required" });
    }

    if (!author) {
      res.status(400).json({ error: "Author ID is required" });
    }

    const comment = await Comment.create({
      text,
      author,
    });

    if (!comment) {
      res.status(500).json({ error: "Failed to create comment" });
    }

    await Recipe.findByIdAndUpdate(id, { $push: { comments: comment._id } });

    return res.status(200).json(comment);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `[RECIPE_COMMENT]: Internal Server Error ${error}` });
  }
}

export async function getTopRecipes(req: Request, res: Response) {
  try {
    const recipes = await Recipe.find({ likes: { $gt: 0 } })
      .populate({
        path: "createdBy",
        select: "_id name username profilePicture",
        model: User,
      })
      .sort({ likes: -1 })
      .limit(3);

    return res.status(200).json(recipes);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `[GET_TOP_RECIPES]: Internal Server Error ${error}` });
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { recipeId } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Comment ID is required" });
    }

    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(500).json({ error: "Failed to delete comment" });
    }

    await Recipe.findByIdAndUpdate(recipeId, { $pull: { comments: id } });

    res.status(200).json({
      message: "[RECIPE_COMMENT_DELETE]: Comment deleted successfully",
    });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
