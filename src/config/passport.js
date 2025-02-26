import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import dotenv from "dotenv";
import UserModel from "../dao/models/UserModel.js";

dotenv.config();

// 📌 Extraer token desde la cookie
const cookieExtractor = (req) => {
  console.log("🛠️ Extrayendo cookies:", req.cookies);

  return req && req.cookies ? req.cookies.token : null;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log("🛠️ Decodificando token JWT:", jwt_payload);

    try {
      const user = await UserModel.findById(jwt_payload.id).lean();
      if (!user) {
        console.log("❌ Usuario no encontrado en la base de datos.");
        return done(null, false);
      }
      console.log("✅ Usuario encontrado:", user);
      return done(null, user);
    } catch (error) {
      console.log("❌ Error en estrategia JWT:", error);
      return done(error, false);
    }
  })
);

export default passport;
