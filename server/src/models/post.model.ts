import mongoose from "mongoose";

const PostModel = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  referenceRecipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
    default: [],
  },
  viewedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
    default: [],
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", PostModel);

export default Post;
