import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "../models/UserModel.js";
import dotenv from "dotenv";

dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req?.cookies?.token || null, // Extraer JWT de las cookies
  ]),
  secretOrKey: process.env.SECRET_KEY, // Clave secreta de .env
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
