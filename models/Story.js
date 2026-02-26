import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    flagged: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);