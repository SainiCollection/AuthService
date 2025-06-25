import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { config } from "dotenv";
config();
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
        url: `${process.env.BASE_URL_SERVER}/api/v1/auth`,
      },
    ],
  },
  apis: [`./src/routes/*.route.ts`],
};

const swaggerSpec = swaggerJsDoc(options);
export {swaggerSpec, swaggerUi};