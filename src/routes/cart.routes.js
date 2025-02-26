import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import CartController from "../controllers/cart.controller.js";

const router = express.Router();

// 📌 Crear un nuevo carrito
router.post("/", CartController.createCart);

// 📌 Obtener un carrito por ID
router.get("/:cid", CartController.getCartById);

// 📌 Agregar un producto al carrito (Solo users)
router.post("/:cid/products", authMiddleware, CartController.addProductToCart);

// 📌 Eliminar un producto del carrito
router.delete(
  "/:cid/products/:pid",
  authMiddleware,
  CartController.removeProductFromCart
);

// 📌 Vaciar el carrito
router.delete("/:cid", authMiddleware, CartController.clearCart);

// 📌 Finalizar la compra
router.post("/:cid/purchase", authMiddleware, CartController.purchaseCart);

export default router;
