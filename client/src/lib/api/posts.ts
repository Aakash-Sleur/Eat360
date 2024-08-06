import axios from "axios";

import { instance } from "@/lib/config";
import {
  IComment,
  INewComment,
  INewPost,
  IPost,
  IUpdateComment,
  IUpdatePost,
} from "../types";

async function getPosts(pageNumber: number = 1) {
  try {
    const pageSize = 10;
    const posts = await axios.get(`${instance.defaults.baseURL}/posts`, {
      params: {
        pageNumber,
        pageSize,
      },
    });
    return posts.data as IPost[];
  } catch (error) {
    console.error(error);
  }
}

async function getPostById(id: string) {
  try {
    const post = await axios.get(`${instance.defaults.baseURL}/posts/${id}`);
    return post.data as IPost;
  } catch (error) {
    console.error(error);
  }
}

async function createPost(post: INewPost): Promise<IPost | null> {
  try {
    const newPost = await axios.post(
      `${instance.defaults.baseURL}/posts`,
      post
    );

    if (!newPost) {
      throw new Error("Failed to create");
    }
    return newPost.data as IPost;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function createComment(comment: INewComment) {
  try {
    const newComment = await axios.post(
      `${instance.defaults.baseURL}/posts/${comment.id}/comments`,
      comment
    );

    if (!newComment) {
      throw new Error("Failed to create");
    }
    return newComment.data as IPost;
  } catch (error) {
    console.error(error);
  }
}

async function updatePost(updateData: IUpdatePost) {
  try {
    const updatedPost = await axios.put(
      `${instance.defaults.baseURL}/posts/${updateData._id}`,
      updateData
    );
    if (!updatedPost) {
      throw new Error("Failed to update");
    }
    return updatedPost.data as IPost;
  } catch (error) {
    console.error(error);
  }
}

async function updateComment(updateData: IUpdateComment) {
  try {
    const updatedComment = await axios.put(
      `${instance.defaults.baseURL}/posts/${updateData._id}/comments`,
      updateData
    );

    if (!updatedComment) {
      throw new Error("Failed to update");
    }
    return updatedComment.data as IComment;
  } catch (error) {
    console.error(error);
  }
}

async function deletePost(postId: string) {
  try {
    await axios.delete(`${instance.defaults.baseURL}/posts/${postId}`);
  } catch (error) {
    console.error(error);
  }
}

async function getPostComments(postId: string) {
  try {
    const comments = await axios.get(
      `${instance.defaults.baseURL}/posts/${postId}/comments`
    );
    return comments.data as IComment[];
  } catch (error) {
    console.error(error);
  }
}

export {
  getPosts,
  getPostById,
  createPost,
  getPostComments,
  createComment,
  updateComment,
  deletePost,
  updatePost,
};
