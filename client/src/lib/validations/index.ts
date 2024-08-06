import * as z from "zod";

const SignUpFormValidation = z.object({
  username: z.string().min(3).max(20),
  name: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

const SignInFormValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  bio: z.string(),
});

const IngredientSchema = z.object({
  name: z.string().min(1, "Item must be at least 1 character"),
  quantity: z.string().min(1, "Quantity must be at least 1 character"),
});

const RecipeValidation = z.object({
  title: z.string().min(3, "Should be at least 3 character "),
  description: z.string().min(3, "Should be at least 3 character "),
  file: z.custom<File[]>(),
  ingredients: z.array(IngredientSchema),
  instructions: z.string().min(3, "Should be at least 3 character "),
  tags: z.string().min(3, "Should be at least 3 character "),
  isPublic: z.boolean(),
  isPremium: z.boolean(),
  price: z.string(),
});

const CommentValidation = z.object({
  comment: z.string().min(1, "Should be at least 3 character "),
});
const PostValidation = z.object({
  text: z.string().min(1, "Should be at least 3 character "),
  file: z.custom<File[]>(),
});

export {
  SignUpFormValidation,
  SignInFormValidation,
  ProfileValidation,
  RecipeValidation,
  CommentValidation,
  PostValidation,
};
