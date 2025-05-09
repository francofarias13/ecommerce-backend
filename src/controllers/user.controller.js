import UserRepository from "../dao/repositories/UserRepository.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserDTO from "../dao/dtos/UserDTO.js";
import logger from "../config/logger.js";

logger.info("Servidor iniciado");
logger.warn("Algo no está bien");
logger.error("Fallo grave");

dotenv.config();

// 📌 Registrar usuario
export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    // 📌 Verificar si el usuario ya existe
    const existingUser = await UserRepository.getUserByEmail(email);
    if (existingUser) {
      logger.warn(`Registro fallido - usuario ya existe: ${email}`);
      return res.status(400).json({ message: "El usuario ya existe" });
    }
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
    logger.info(`✅ Usuario registrado: ${newUser.email}`);

    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: new UserDTO(newUser), // ✅ Usamos DTO para evitar exponer datos sensibles
      redirectUrl: "/login",
    });
  } catch (error) {
    logger.error("❌ Error al registrar usuario", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// 📌 Login usuario
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserRepository.getUserByEmail(email);
    if (!user){
      logger.warn(`Login fallido - usuario no encontrado: ${email}`);
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // 📌 Verificar contraseña
    if (!comparePassword(password, user.password)) {
      logger.warn(`Login fallido - contraseña incorrecta: ${email}`);
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    logger.info(`✅ Login exitoso para: ${email}`);
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
    logger.error("❌ Error en el login", error);
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
