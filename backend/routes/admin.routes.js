import { Router } from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  getAllProjects,
  deleteProject,
  getAllInvestments,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);

router.get("/projects", getAllProjects);

router.delete("/projects/:id", deleteProject);

router.get("/investments", getAllInvestments);

export default router;