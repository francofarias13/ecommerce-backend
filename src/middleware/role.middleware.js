export const roleMiddleware = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Acceso denegado. No tienes permisos suficientes." });
    }

    next();
  };
};
