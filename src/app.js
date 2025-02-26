import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";
import productRoutes from "./routes/products.routes.js";
import userRoutes from "./routes/user.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import cartRoutes from "./routes/cart.routes.js";

// Configurar variables de entorno
dotenv.config();

// Crear la app de Express
const app = express();

// 📌 Middlewares (deben ir ANTES de las rutas)
app.use(express.json()); // Para recibir JSON
app.use(express.urlencoded({ extended: true })); // Para recibir formularios
app.use(cookieParser()); // Para manejar cookies
app.use(cors()); // Habilitar CORS
app.use(passport.initialize()); // Inicializar Passport

// 📌 Conectar a MongoDB (eliminamos opciones deprecadas)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
  }
};
connectDB();

// 📌 Configurar rutas (después de los middlewares)
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

// 📌 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.info(`🚀 Servidor en ejecución en http://localhost:${PORT}`);
});
