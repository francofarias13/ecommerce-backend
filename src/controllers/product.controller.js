import ProductRepository from "../dao/repositories/ProductRepository.js";

class ProductController {
  // 📌 Obtener todos los productos
  static async getAllProducts(req, res) {
    try {
      const products = await ProductRepository.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  // 📌 Obtener un producto por ID
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductRepository.getProductById(id);

      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  // 📌 Crear un producto (Solo Admin)
  static async createProduct(req, res) {
    try {
      const { title, description, price, stock, category } = req.body;

      if (!title || !description || !price || !stock || !category) {
        return res
          .status(400)
          .json({ message: "Todos los campos son obligatorios" });
      }

      const product = await ProductRepository.createProduct({
        title,
        description,
        price,
        stock,
        category,
      });
      res
        .status(201)
        .json({ message: "Producto agregado correctamente", product });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  // 📌 Actualizar un producto (Solo Admin)
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedProduct = await ProductRepository.updateProduct(
        id,
        updateData
      );
      if (!updatedProduct)
        return res.status(404).json({ message: "Producto no encontrado" });

      res
        .status(200)
        .json({
          message: "Producto actualizado correctamente",
          updatedProduct,
        });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }

  // 📌 Eliminar un producto (Solo Admin)
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await ProductRepository.deleteProduct(id);

      if (!deletedProduct)
        return res.status(404).json({ message: "Producto no encontrado" });

      res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
}

export default ProductController;
