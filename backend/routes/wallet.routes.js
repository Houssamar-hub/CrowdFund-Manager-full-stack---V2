import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getBalance,
  addFunds,
  getTransactions,
} from "../controllers/wallet.controller.js";

const router = Router();

router.use(protect);

router.get("/balance", getBalance);
router.post("/add-funds", addFunds);
router.get("/transactions", getTransactions);

export default router;