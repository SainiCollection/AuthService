import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: `3.0.0`,
    info: {
      title: `Auth API`,
      version: `1.0.0`,
      description: `API documentation for the authentication service`,
    },
    servers: [
      {
        url: `http://0.0.0.0:2000`,
      },
    ],
  },
  apis: [`./src/routes/*.route.ts`],
};

const swaggerSpec = swaggerJsDoc(options);
export {swaggerSpec, swaggerUi};