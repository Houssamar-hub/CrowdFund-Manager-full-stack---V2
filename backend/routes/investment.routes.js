import { Router } from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import { invest } from "../controllers/investment.controller.js";

const router = Router();

router.post("/", protect, authorizeRoles("investor"), invest);

export default router;
