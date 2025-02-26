import express from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js"; // ✅ Importación correcta

const router = express.Router();

// 📌 Ruta de registro
router.post("/register", registerUser);

// 📌 Ruta de login
router.post("/login", loginUser);

export default router;
