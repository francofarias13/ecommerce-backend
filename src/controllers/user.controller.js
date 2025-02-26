import UserRepository from "../dao/repositories/UserRepository.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserDTO from "../dao/dtos/UserDTO.js";

dotenv.config();

// 📌 Registrar usuario
export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    // 📌 Verificar si el usuario ya existe
    const existingUser = await UserRepository.getUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "El usuario ya existe" });

    // 📌 Determinar el rol del usuario (por defecto "user")
    const userRole = role === "admin" ? "admin" : "user";

    // 📌 Crear usuario en la base de datos
    const newUser = await UserRepository.createUser({
      first_name,
      last_name,
      email,
      age,
      password: hashPassword(password),
      role: userRole,
    });

    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: new UserDTO(newUser), // ✅ Usamos DTO para evitar exponer datos sensibles
      redirectUrl: "/login",
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 📌 Login usuario
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserRepository.getUserByEmail(email);
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado" });

    // 📌 Verificar contraseña
    if (!comparePassword(password, user.password)) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 📌 Generar token JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // 📌 Guardar el token en una cookie segura
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Cambiar a true en producción con HTTPS
      maxAge: 3600000, // 1 hora
    });

    res.status(200).json({
      message: "Login exitoso",
      token,
      redirectUrl: "/profile",
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 📌 Obtener usuario autenticado
export const currentUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "No autorizado" });

    res.status(200).json(new UserDTO(req.user)); // ✅ Usamos DTO para evitar enviar datos sensibles
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
