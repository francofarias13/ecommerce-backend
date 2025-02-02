import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/current", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Usuario autenticado",
    user: req.user,
  });
});

export default router;
