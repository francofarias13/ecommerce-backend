# Imagen base
FROM node:18.20.2-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

COPY package*.json ./

# Copiar archivos del proyecto al contenedor
COPY . .

# Instalar dependencias
RUN npm install

# Puerto expuesto (coincide con tu .env)
EXPOSE 3000

# Comando por defecto al iniciar el contenedor
CMD ["npm", "run", "dev"]