import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Devuelve los datos del usuario autenticado (requiere token JWT)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: No autorizado - token inválido o ausente
 */

const router = express.Router();

router.get("/current", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Usuario autenticado",
    user: req.user,
  });
});

export default router;
