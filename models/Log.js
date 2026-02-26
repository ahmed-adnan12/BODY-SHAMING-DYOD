import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    actor: { type: String, default: "public" },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);