import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  createProject,
  getMyProjects,
  getOpenProjects,
  getProjectById,
  updateProject,
  closeProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = Router();

// Routes CRUD pour les projets
router.post("/", protect,authorizeRoles("owner"), createProject);           // POST /projects - Créer un projet
router.get("/mine", protect,authorizeRoles("owner"), getMyProjects);        // GET /projects/mine - Mes projets
router.get("/open", protect, getOpenProjects);                              // GET /projects/open - Projets ouverts
router.get("/:id", protect, authorizeRoles("owner"),getProjectById);        // GET /projects/:id - Détail projet
router.put("/:id", protect,authorizeRoles("owner"), updateProject);         // PUT /projects/:id - Modifier projet
router.patch("/:id/close", authorizeRoles("owner"),protect, closeProject);  // PATCH /projects/:id/close - Fermer projet
router.delete("/:id",authorizeRoles("owner"), protect, deleteProject);      // DELETE /projects/:id - Supprimer projet

export default router;