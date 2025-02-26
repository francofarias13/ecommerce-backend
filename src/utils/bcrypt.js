import bcrypt from "bcrypt";

// Hashear contraseña
export const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Comparar contraseña ingresada con la almacenada en la BD
export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
