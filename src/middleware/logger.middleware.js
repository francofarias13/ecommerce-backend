import logger from "../config/logger.js";

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
