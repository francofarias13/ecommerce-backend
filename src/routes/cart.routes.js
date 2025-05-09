import express from "express";
import CartController from "../controllers/cart.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Endpoints relacionados con carritos de compra
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crear un nuevo carrito
 *     tags: [Carts]
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 */
router.post("/", CartController.createCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtener los productos de un carrito por ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito encontrado
 *       404:
 *         description: Carrito no encontrado
 */
router.get("/:cid", CartController.getCartById);

/**
 * @swagger
 * /api/carts/{cid}/products:
 *   post:
 *     summary: Agregar un producto al carrito (solo usuarios)
 *     tags: [Carts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto agregado
 *       403:
 *         description: Solo usuarios pueden agregar productos
 */
router.post("/:cid/products", authMiddleware, CartController.addProductToCart);

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.delete("/:cid/products/:pid", CartController.removeProductFromCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Vaciar un carrito
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito vaciado
 *       404:
 *         description: Carrito no encontrado
 */
router.delete("/:cid", CartController.clearCart);

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Finalizar compra y generar ticket
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra exitosa
 *       400:
 *         description: No se pudo completar la compra
 */
router.post("/:cid/purchase", authMiddleware, CartController.purchaseCart);

export default router;
