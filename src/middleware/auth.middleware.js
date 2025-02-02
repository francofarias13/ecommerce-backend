import passport from "passport";

export const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return res.status(500).json({ message: "Error en el servidor", err });
    if (!user) return res.status(401).json({ message: "No autorizado" });

    req.user = user; // Guarda el usuario en la request
    next();
  })(req, res, next);
};
