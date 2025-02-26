# 🚀 ECOMMERCE BACKEND

Backend desarrollado con Node.js, Express y MongoDB para gestionar usuarios, productos y carritos de compras.

## 📌 Tecnologías utilizadas

- **Node.js**
- **Express.js**
- **MongoDB y Mongoose**
- **JWT (JSON Web Token) para autenticación**
- **bcrypt para encriptación de contraseñas**
- **dotenv para configuración de variables de entorno**

---

## 📌 Instalación y configuración

### **1️⃣ Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/ecommerce-backend.git
cd ecommerce-backend
```

### **2️⃣ Instalar dependencias**

```bash
npm install
```

### **3️⃣ Configurar el archivo ****`.env`**

Crear un archivo `.env` en la raíz del proyecto con los siguientes valores:

```env
PORT=3000
MONGO_URI=mongodb+srv://franco:1234@francofarias.awogk.mongodb.net/?retryWrites=true&w=majority&appName=FrancoFarias
SECRET_KEY=clave_secreta
```

> **Nota:** También se incluye un archivo `.env.example` con la estructura necesaria.

### **4️⃣ Iniciar el servidor**

```bash
npm run dev
```

El servidor estará corriendo en: `http://localhost:3000`

---

## 📌 Rutas de la API

### **🔹 Usuarios (****`/api/users`****)**

| Método | Endpoint    | Descripción                     |
| ------ | ----------- | ------------------------------- |
| `POST` | `/register` | Registra un nuevo usuario       |
| `POST` | `/login`    | Inicia sesión y genera un token |

Ejemplo de registro:

```json
{
  "first_name": "Franco",
  "last_name": "Farias",
  "email": "franco@example.com",
  "age": 29,
  "password": "123456"
}
```

### **🔹 Productos (****`/api/products`****)**

| Método   | Endpoint | Descripción                         |
| -------- | -------- | ----------------------------------- |
| `GET`    | `/`      | Obtiene todos los productos         |
| `GET`    | `/:id`   | Obtiene un producto por ID          |
| `POST`   | `/`      | Crea un nuevo producto (Solo admin) |
| `PUT`    | `/:id`   | Actualiza un producto (Solo admin)  |
| `DELETE` | `/:id`   | Elimina un producto (Solo admin)    |

### **🔹 Carrito (****`/api/carts`****)**

| Método   | Endpoint              | Descripción                                   |
| -------- | --------------------- | --------------------------------------------- |
| `POST`   | `/`                   | Crea un nuevo carrito                         |
| `GET`    | `/:cid`               | Obtiene los productos de un carrito           |
| `POST`   | `/:cid/products`      | Agrega un producto al carrito (Solo usuarios) |
| `DELETE` | `/:cid/products/:pid` | Elimina un producto del carrito               |
| `DELETE` | `/:cid`               | Vacía el carrito                              |
| `POST`   | `/:cid/purchase`      | Finaliza la compra y genera un ticket         |

---

## 📌 Ejemplo de uso en Postman

> **📢 Importante:** Para probar las rutas protegidas, se debe enviar el `token` en las cookies.

1️⃣ **Registrar un usuario:** `POST http://localhost:3000/api/users/register`
2️⃣ **Iniciar sesión:** `POST http://localhost:3000/api/users/login`
3️⃣ **Agregar un producto al carrito:** `POST http://localhost:3000/api/carts/:cid/products`
4️⃣ **Finalizar la compra:** `POST http://localhost:3000/api/carts/:cid/purchase`

---

## 📌 Autor

**Franco Farias** - *Desarrollador Backend* 🚀

