import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: String,
        required: true,
      },
    },
  ],
  description: {
    type: String,
    required: true,
  },
  reference: { type: String },
  banner_image: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  collaborations: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Collaboration",
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  views: {
    type: Number,
    default: 0,
  },
  viewedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  boughtBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  price: {
    type: Number,
    default: 0,
  },
  tags: [{ type: String }],
  isPublic: {
    type: Boolean,
    default: true,
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
  },
  published: {
    type: Boolean,
    default: true,
  },
  scheduledAt: {
    type: Date,
    default: null,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
