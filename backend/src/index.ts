import cors from "cors";
import express from "express";
import authRouter from "./router/auth";
import researchRouter from "./router/research";

const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();

app.use(express.json());
// app.use(cors());
app.use(cors({ origin: FRONTEND_URL }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/auth", authRouter);
app.use("/research", researchRouter);

app.listen(PORT, () => console.log(`API Server listening on port ${PORT}`));
