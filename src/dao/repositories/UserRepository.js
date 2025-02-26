import UserModel from "../models/UserModel.js";

class UserRepository {
  async getAllUsers() {
    return await UserModel.find();
  }

  async getUserByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async getUserById(id) {
    return await UserModel.findById(id);
  }

  async createUser(userData) {
    return await UserModel.create(userData);
  }
}

export default new UserRepository();
