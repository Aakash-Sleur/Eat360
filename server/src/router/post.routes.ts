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

export default (router: Router) => {
  router
    .post("/posts", createPost)
    .get("/posts", getAllPosts)
    .get("/posts/:id", getPostById)
    .put("/posts/:id", updatePost)
    .delete("/posts/:id", deletePost)
    .get("/posts/:id/comments", getPostComments)
    .post("/posts/:id/comments", commentPost)
    .put("/posts/:id/comments", updatePostComment)
    .delete("/posts/:id/comments", deleteComment);

  return router;
};
