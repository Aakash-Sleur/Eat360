import { Request, Response } from "express";

import Post from "../models/post.model";
import User from "../models/user.model";
import Comment from "../models/comment.model";

async function createPost(req: Request, res: Response) {
  try {
    const { text, author, ...rest } = req.body;

    if (!text || !author) {
      return res.status(400).json({ error: "Text and author are required" });
    }

    const post = await Post.create({
      text,
      author,
      ...rest,
    });

    if (!post) {
      res.status(500).json({ error: "Failed to create post" });
    }

    await User.findByIdAndUpdate(author, {
      $push: { posts: post._id },
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllPosts(req: Request, res: Response) {
  try {
    const pageNumber = parseInt(req.query.pageNumber?.toString()) || 1;
    const pageSize = parseInt(req.query.pageSize?.toString()) || 10;

    const skipAmount = (pageNumber - 1) * pageSize;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "comments",
        model: Comment,
      });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error ${error}` });
  }
}

async function getPostById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const post = await Post.findById(id)
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "comments",
        model: Comment,
      });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.log("[GET_POST_BY_ID_ERROR]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updatePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { ...updatedData } = req.body;

    if (!id) {
      res.status(400).json({ error: "Post ID is required" });
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedPost) {
      res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deletePost(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    for (const comment of post.comments || []) {
      await Comment.findByIdAndDelete(comment);
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(500).json({ error: "Failed to delete recipe" });
    }

    await User.findByIdAndUpdate(post.author, {
      $pull: { posts: id },
    });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error ${error}` });
  }
}

async function commentPost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { author, text } = req.body;

    if (!id) {
      res.status(400).json({ error: "Post ID is required" });
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

    await Post.findByIdAndUpdate(id, { $push: { comments: comment._id } });

    return res.status(200).json(comment);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `[POST_COMMENT]: Internal Server Error ${error}` });
  }
}

async function getPostComments(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("comments");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comments = post.comments;
    return res.status(200).json(comments);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `[GET_POST_COMMENTS]: Internal Server Error ${error}` });
  }
}

async function updatePostComment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const comment = await Comment.findByIdAndUpdate(id, { ...data });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    return res.status(200).json(comment);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `[POST_COMMENT_UPDATE]: Internal Server Error ${error}` });
  }
}

async function deleteComment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { postId } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Comment ID is required" });
    }

    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(500).json({ error: "Failed to delete comment" });
    }

    await Post.findByIdAndUpdate(postId, { $pull: { comments: id } });

    res
      .status(200)
      .json({ message: "[POST_COMMENT_DELETE]: Comment deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `[POST_COMMENT_DELETE]: Internal Server Error ${error}` });
  }
}

export {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  commentPost,
  getPostComments,
  updatePostComment,
  deleteComment,
};
