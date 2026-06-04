import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  invest,
  getMyInvestments,
  getProjectInvestments,
  getPortfolio,
} from "../controllers/investment.controller.js";

const router = Router();

router.use(protect);

router.post("/", invest);
router.get("/mine", getMyInvestments);
router.get("/portfolio", getPortfolio);
router.get("/project/:projectId", getProjectInvestments);

export default router;