import ProductModel from "../models/ProductModel.js";

class ProductRepository {
  async getAllProducts() {
    return await ProductModel.find();
  }

  async getProductById(id) {
    return await ProductModel.findById(id);
  }

  async createProduct(productData) {
    return await ProductModel.create(productData);
  }

  async updateProduct(id, updateData) {
    return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteProduct(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}

export default new ProductRepository();
