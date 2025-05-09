import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    
    openapi: "3.0.1",
    info: {
      title: "Ecommerce Backend API",
      description: "Documentación de la API del ecommerce desarrollada con Node.js y Express",
    },
  },
  apis: ["./src/routes/*.js"], // rutas donde están los comentarios de Swagger
};

const specs = swaggerJSDoc(swaggerOptions);

export { swaggerUiExpress, specs };
