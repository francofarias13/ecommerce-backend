import UserModel from "../models/UserModel.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Verifica si el usuario ya existe
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "El usuario ya existe" });

    // Crea nuevo usuario con contraseña hasheada
    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      age,
      password: hashPassword(password),
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado con éxito" });

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

dotenv.config();

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    // Comparar contraseñas
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    // Crear token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Guardar el token en una cookie segura
    res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 3600000 });

    res.status(200).json({ message: "Login exitoso", token });

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};
