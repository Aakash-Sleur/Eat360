import { Router } from "express";

import {
  commentPost,
  createPost,
  deleteComment,
  deletePost,
  getAllPosts,
  getPostById,
  getPostComments,
  updatePost,
  updatePostComment,
} from "../controllers/post.controller";
import { requireAuth } from "../middleware/require-auth";

export default (router: Router) => {
  router
    .post("/posts", requireAuth, createPost)
    .get("/posts", requireAuth, getAllPosts)
    .get("/posts/:id", requireAuth, getPostById)
    .put("/posts/:id", requireAuth, updatePost)
    .delete("/posts/:id", requireAuth, deletePost)
    .get("/posts/:id/comments", requireAuth, getPostComments)
    .post("/posts/:id/comments", requireAuth, commentPost)
    .put("/posts/:id/comments", requireAuth, updatePostComment)
    .delete("/posts/:id/comments", requireAuth, deleteComment);

  return router;
};
