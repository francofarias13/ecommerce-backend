import passport from "passport";
import UserDTO from "../dao/dtos/UserDTO.js";

export const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user) return res.status(401).json({ message: "No autorizado" });

    req.user = new UserDTO(user); // ✅ Convertimos el usuario a DTO
    next();
  })(req, res, next);
};
