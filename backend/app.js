import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import investmentRoutes from "./routes/investment.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/investments", investmentRoutes);
app.use("/wallet", walletRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

export default app;