import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    capital: { type: Number, required: true, min: 1000 },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    maxInvestmentPercent: { type: Number, default: 30, min: 1, max: 100 },
    investments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Investment" }],
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);