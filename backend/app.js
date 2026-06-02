import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import cors from "cors";
import investmentRoutes from "./routes/investment.routes.js";

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

// Routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes); 
app.use("/investment", investmentRoutes); 

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    requestedUrl: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: err.message });
});

export default app;