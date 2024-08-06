import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { createUser, loginUser } from "../api/auth";
import { QUERY_KEYS } from "./querykeys";
import {
  ICreatedRecipe,
  IFollowersUpdate,
  INewComment,
  INewPost,
  INewUser,
  IUpdateComment,
  IUpdatedRecipe,
  IUpdatePost,
  IUpdateProfile,
} from "../types";
import {
  followUser,
  getUserById,
  getUserFollowersAndFollowing,
  getUsers,
  updateUser,
} from "../api/user";
import {
  createRecipe,
  createRecipeComment,
  deleteRecipe,
  getRecipeById,
  getRecipes,
  getTopRecipes,
  searchRecipe,
  updateRecipe,
} from "../api/recipe";
import {
  createComment,
  createPost,
  deletePost,
  getPostById,
  getPostComments,
  getPosts,
  updateComment,
  updatePost,
} from "../api/posts";

export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUser(user),
  });
};

export const useCreateRecipeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipe: ICreatedRecipe) => createRecipe(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECIPES],
      });
    },
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      loginUser(credentials),
  });
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(),
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, id],
    queryFn: () => getUserById(id),
  });
};

export const useGetFollowersAndFollowing = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWERS_AND_FOLLOWING],
    queryFn: () => getUserFollowersAndFollowing(id),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: IUpdateProfile) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?._id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWERS_AND_FOLLOWING],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
    },
  });
};

export const useUpdateFollowers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData: IFollowersUpdate) => followUser(updatedData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?._id],
      });
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedRecipe: IUpdatedRecipe) => updateRecipe(updatedRecipe),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECIPE_BY_ID, data?._id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECIPES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TOP_RECIPES],
      });
    },
  });
};

export const useSearchRecipe = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SEARCH_RECIPES],
    queryFn: () => searchRecipe(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: IUpdateComment) => updateComment(updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_COMMENTS],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID],
        });
    },
  });
};

export const useGetRecipes = (pageSize: number = 10) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_RECIPES],
    queryFn: ({ pageParam = 1 }) => getRecipes(pageParam, pageSize),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.length === 0 && lastPage) return undefined; // No more pages
      return pages.length + 1;
    },
    initialPageParam: 1,
  });
};

export const useGetRecipeById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECIPE_BY_ID, id],
    queryFn: () => getRecipeById(id),
  });
};

export const useGetTopRecipes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TOP_RECIPES],
    queryFn: () => getTopRecipes(),
  });
};

export const useDeleteRecipeById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECIPES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECIPE_BY_ID],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TOP_RECIPES],
      });
    },
  });
};

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POSTS],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.length === 0 && lastPage) return undefined; // No more pages
      return pages.length + 1; // Increment page number
    },
    initialPageParam: 1,
  });
};

export const useGetPostById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID],
    queryFn: () => getPostById(id),
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID],
        });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdatePost) => updatePost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID],
        });
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: INewComment) => createComment(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
      });
    },
  });
};

export const useCreateRecipeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: INewComment) => createRecipeComment(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECIPE_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECIPES],
      });
    },
  });
};

export const useGetPostComments = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMMENTS, postId],
    queryFn: () => getPostComments(postId),
  });
};
