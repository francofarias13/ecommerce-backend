import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();

// 📌 Ruta para agregar un producto (SOLO ADMIN)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  ProductController.createProduct
);

// 📌 Ruta para obtener todos los productos (Disponible para todos)
router.get("/", ProductController.getAllProducts);

// 📌 Ruta para obtener un producto por ID (Disponible para todos)
router.get("/:id", ProductController.getProductById);

// 📌 Ruta para actualizar un producto (SOLO ADMIN)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  ProductController.updateProduct
);

// 📌 Ruta para eliminar un producto (SOLO ADMIN)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  ProductController.deleteProduct
);

export default router;
