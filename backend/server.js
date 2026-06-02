import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Route de test directe
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Received signup request:", { name, email, role });
    
    // Import User model ici pour éviter les problèmes de circularité
    const { User } = await import("./models/user.model.js");
    
    const user = await User.create({
      name,
      email,
      password,
      role: role || "owner"
    });
    
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Test signup: http://localhost:${PORT}/auth/signup`);
    });
  })
  .catch(err => console.error(err));