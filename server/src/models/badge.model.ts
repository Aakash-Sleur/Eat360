import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String },
});

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;
