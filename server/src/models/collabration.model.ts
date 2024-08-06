import mongoose from "mongoose";

const collaborationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
});

const Collaboration = mongoose.model("Collaboration", collaborationSchema);
export default Collaboration;
