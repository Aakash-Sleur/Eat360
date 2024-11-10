import { Response, Request } from "express";

import User from "../models/user.model";
import Post from "../models/post.model";
import Recipe from "../models/recipe.model";

export async function getUserById(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    // Await the result of the query to get the user object
    const user = await User.findById(userId)
      .populate({
        path: "posts",
        model: Post,
      })
      .populate({
        path: "savedRecipes",
        model: Recipe,
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user object in the response
    return res.status(200).json(user);
  } catch (e) {
    console.log("[GET_USER_BY_ID_ERROR]", e);
    // Handle errors properly
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFollowersAndFollowing(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select("followers following")
      .populate({ path: "followers", model: User })
      .populate({ path: "following", model: User });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllUser(req: Request, res: Response) {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users);
  } catch (e) {
    console.error("[GET_USER_ALL_ERROR]", e); // Using console.error for errors
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (e) {
    console.log("[UPDATE_USER_ERROR]", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTopUsers(req: Request, res: Response) {
  try {
    const topUsers = await User.find().sort({ followers: -1 }).limit(3);
    return res.status(200).json(topUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
