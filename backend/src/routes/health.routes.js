import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req, res) => {
  const database = mongoose.connection.readyState === 1
    ? "connected"
    : "disconnected";

  res.json({
    success: true,
    message: "Portfolio API running",
    database,
  });
});

export default router;
