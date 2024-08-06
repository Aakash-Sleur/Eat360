import mongoose from "mongoose";

// User Config
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  collections: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Collection",
    default: [],
  },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  bio: {
    type: String,
    required: false,
    default: "",
  },
  profilePicture: {
    type: String,
    required: false,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recipes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Recipe",
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  badges: { type: [mongoose.Schema.Types.ObjectId], ref: "Badge" },
  posts: { type: [mongoose.Schema.Types.ObjectId], ref: "Post" },
  savedRecipes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Recipe",
    default: [],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  permissions: [{ type: String }],
});

const User = mongoose.model("User", UserSchema);

export default User;

export const getUserByEmail = (email: string) => User.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  User.findOne({ "authentication.sessionToken": sessionToken });
export const createUser = (values: Record<string, any>) =>
  new User(values).save().then((user) => user.toObject());
