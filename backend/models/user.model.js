import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "owner", "investor"],
      default: "investor", // Par défaut investor
    },
    balance: { type: Number, default: 0 },
    transactions: [
      {
        type: {
          type: String,
          enum: ["deposit", "withdrawal", "investment"],
          default: "deposit",
        },
        amount: { type: Number, required: true },
        description: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model("User", userSchema);
