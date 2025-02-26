import CartModel from "../models/CartModel.js";

class CartRepository {
  // 📌 Crear un nuevo carrito vacío
  async createCart() {
    return await CartModel.create({ products: [] });
  }

  // 📌 Obtener un carrito por su ID
  async getCartById(cartId) {
    return await CartModel.findById(cartId).populate("products.product");
  }

  // 📌 Agregar un producto a un carrito
  async addProductToCart(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    // 📌 Verificar si el producto ya está en el carrito
    const existingProduct = cart.products.find(
      (p) => p.product.toString() === productId
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  }

  // 📌 Eliminar un producto del carrito
  async removeProductFromCart(cartId, productId) {
    return await CartModel.findByIdAndUpdate(
      cartId,
      {
        $pull: { products: { product: productId } },
      },
      { new: true }
    );
  }

  // 📌 Actualizar la cantidad de un producto en el carrito
  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const product = cart.products.find(
      (p) => p.product.toString() === productId
    );
    if (!product) return null;

    product.quantity = quantity;
    await cart.save();
    return cart;
  }

  // 📌 Vaciar un carrito
  async clearCart(cartId) {
    return await CartModel.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
  }
}

export default new CartRepository();
