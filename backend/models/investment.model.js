import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    percentage: { type: Number }, 
  },
  { timestamps: true },
);

export const Investment = mongoose.model("Investment", investmentSchema);
