import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true, required: true },
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
