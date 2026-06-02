import { Router } from "express";
import { signup, login } from "../controllers/auth.controller.js";

const router = Router();

// IMPORTANT: La route doit être exactement "/signup" pas "/signup" avec autre chose
router.post("/signup", signup);
router.post("/login", login);

// Route de test
router.get("/test", (req, res) => {
  res.json({ message: "Auth route is working!" });
});

export default router;