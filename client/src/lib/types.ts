export type IUser = {
  _id: string;
  username: string;
  name: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken: string;
  };
  bio?: string;
  profilePicture?: string;
  location?: string;
  createdAt: string;
  recipes: string[];
  following: string[];
  followers: string[];
  badges: string[];
  purchasedCompendiums: string[];
  posts: IPost[];
  savedRecipes: IRecipe[];
  role: "user" | "admin";
  permissions: string[];
};

export type IProfile = {
  _id: string;
  username: string;
  name: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken: string;
  };
  bio?: string;
  profilePicture?: string;
  location?: string;
  createdAt: string;
  recipes: string[];
  following: IUser[];
  followers: IUser[];
  badges: string[];
  purchasedCompendiums: string[];
  posts: IPost[];
  savedRecipes: string[];
  role: "user" | "admin";
  permissions: string[];
};

export type INewUser = {
  username: string;
  name: string;
  email: string;
  password: string;
};

export type INavLink = {
  imgUrl: string;
  route: string;
  label: string;
};

export type IUpdateProfile = {
  id: string;
  name?: string;
  username?: string;
  bio?: string;
  profilePicture?: File[];
  savedRecipes?: string[];
};

export type FilterOptions = {
  tags: string[];
  isPremium: boolean | null;
  sortBy: string;
};

type Ingredient = {
  name: string;
  quantity: string;
};

export type IRecipe = {
  _id: string;
  title: string;
  ingredients: Ingredient[];
  description: string;
  banner_image: string;
  reference?: string;
  instructions: string;
  createdBy: string;
  createdAt: Date;
  collaborations: string[];
  likes: number;
  likedBy: string[];
  views: number;
  viewedBy: string[];
  isPremium: boolean;
  tags: string[];
  isPublic: boolean;
  price: number;
  boughtBy: string[];
  comments: IRecipeComment[];
};

export type ICreatedRecipe = {
  title: string;
  ingredients: { name: string; quantity: string }[];
  banner_image?: string;
  instructions: string;
  description: string;
  tags?: string[];
  isPremium?: boolean;
  createdBy: string;
  isPublic?: boolean;
};

export type IUpdatedRecipe = {
  _id: string;
  title?: string;
  ingredients?: { name: string; quantity: string }[];
  banner_image?: string;
  instructions?: string;
  description?: string;
  tags?: string[];
  isPremium?: boolean;
  likes?: number;
  likedBy?: string[];
  views?: number;
  viewedBy?: string[];
};

export type IPost = {
  _id: string;
  text: string;
  image?: string;
  author: IUser;
  referenceRecipe: string;
  likes: number;
  views: number;
  likedBy: string[];
  viewedBy: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
};

export type INewPost = {
  text: string;
  author: string;
  referenceRecipe?: string;
  image?: string;
};

export type INewComment = {
  text: string;
  author: string;
  id?: string;
};

export type IFollowersUpdate = {
  currentUserId: string;
  otherUserId: string;
  followersList: string[];
  followingList: string[];
};

export type IUpdateComment = {
  _id: string;
  text?: string;
  likes?: number;
  likedBy?: string[];
  dislikes?: number;
  dislikedBy?: string[];
};

export type IUpdatePost = {
  _id: string;
  text?: string;
  likes?: number;
  likedBy?: string[];
  views?: number;
  viewedBy?: string[];
};

export type IComment = {
  _id: string;
  author: string;
  text: string;
  likes: number;
  likedBy: string[];
  dislikes: number;
  dislikedBy: string[];
  createdAt: Date;
};

export type IRecipeComment = {
  _id: string;
  author: {
    _id: string;
    username: string;
    name: string;
    profilePicture: string;
  };
  text: string;
  likes: number;
  likedBy: string[];
  dislikes: number;
  dislikedBy: string[];
  createdAt: Date;
};

export type ICreatePost = {
  text: string;
  author: string;
  image?: string;
};
