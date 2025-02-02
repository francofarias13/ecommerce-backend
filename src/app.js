import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";

// Configurar variables de entorno
dotenv.config();

// Crear la app de Express
const app = express();

// Middlewares
app.use(express.json()); // Para recibir JSON
app.use(express.urlencoded({ extended: true })); // Para recibir formularios
app.use(cookieParser()); // Para manejar cookies
app.use(cors()); // Habilitar CORS
app.use(passport.initialize()); // Inicializar Passport

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
  }
};
connectDB();

// Importar rutas
import userRoutes from "./routes/user.routes.js";
import sessionRoutes from "./routes/session.routes.js";

app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando! 🚀");
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
