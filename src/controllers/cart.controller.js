import CartRepository from "../dao/repositories/CartRepository.js";
import ProductRepository from "../dao/repositories/ProductRepository.js";
import TicketRepository from "../dao/repositories/TicketRepository.js";
import logger from "../config/logger.js";

class CartController {
  // 📌 Crear un nuevo carrito
  static async createCart(req, res) {
    try {
      const newCart = await CartRepository.createCart();
      logger.info(`🛒 Carrito creado con ID: ${newCart._id}`);
      res.status(201).json({ message: "Carrito creado", cart: newCart });
    } catch (error) {
      logger.error("❌ Error al crear carrito", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  // 📌 Obtener productos de un carrito
  static async getCartById(req, res) {
    try {
      const { cid } = req.params;
      const cart = await CartRepository.getCartById(cid);
      if (!cart)
        return res.status(404).json({ message: "Carrito no encontrado" });
      logger.info(`✅ Compra realizada para carrito ${cid} por ${req.user.email}`);
      res.status(200).json(cart);
    } catch (error) {
      logger.error("❌ Error en la compra", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  // 📌 Agregar un producto al carrito (SOLO USERS)
  static async addProductToCart(req, res) {
    try {
      const { cid } = req.params;
      const { productId, quantity } = req.body;

      if (req.user.role !== "user") {
        return res
          .status(403)
          .json({
            message: "Solo los usuarios pueden agregar productos al carrito",
          });
      }

      const updatedCart = await CartRepository.addProductToCart(
        cid,
        productId,
        quantity
      );
      if (!updatedCart)
        return res.status(404).json({ message: "Carrito no encontrado" });

      res
        .status(200)
        .json({ message: "Producto agregado al carrito", cart: updatedCart });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  // 📌 Eliminar un producto del carrito
  static async removeProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await CartRepository.removeProductFromCart(cid, pid);
      if (!updatedCart)
        return res
          .status(404)
          .json({ message: "Carrito o producto no encontrado" });

      res
        .status(200)
        .json({ message: "Producto eliminado del carrito", cart: updatedCart });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  // 📌 Vaciar carrito
  static async clearCart(req, res) {
    try {
      const { cid } = req.params;
      const updatedCart = await CartRepository.clearCart(cid);
      if (!updatedCart)
        return res.status(404).json({ message: "Carrito no encontrado" });

      res.status(200).json({ message: "Carrito vaciado", cart: updatedCart });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  // 📌 Finalizar la compra
  static async purchaseCart(req, res) {
    try {
      const { cid } = req.params;
      const cart = await CartRepository.getCartById(cid);

      if (!cart)
        return res.status(404).json({ message: "Carrito no encontrado" });

      let totalAmount = 0;
      let productosNoComprados = [];
      let productosComprados = [];

      // 📌 Verificar stock y actualizar productos
      for (let item of cart.products) {
        const product = await ProductRepository.getProductById(
          item.product._id
        );

        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save(); // ✅ Actualiza el stock del producto
          totalAmount += product.price * item.quantity;
          productosComprados.push(item.product._id); // ✅ Se compró este producto
        } else {
          productosNoComprados.push(item.product._id); // ❌ No había stock suficiente
        }
      }

      // 📌 Si hubo productos comprados, generamos el ticket
      if (productosComprados.length > 0) {
        const ticket = await TicketRepository.createTicket({
          amount: totalAmount,
          purchaser: req.user.email,
        });

        // 📌 Filtrar el carrito para dejar solo los productos no comprados
        cart.products = cart.products.filter((item) =>
          productosNoComprados.includes(item.product._id)
        );
        await cart.save();

        return res.status(200).json({
          message: "Compra realizada con éxito",
          ticket,
          productosNoComprados,
        });
      }

      // ❌ Si no se pudo comprar nada, devolver error
      res
        .status(400)
        .json({
          message: "No se pudo completar la compra, no hay stock suficiente",
          productosNoComprados,
        });
    } catch (error) {
      console.error("❌ Error en la compra:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
}

export default CartController;
