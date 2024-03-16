import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';
import { Router } from 'express';

const router = Router();

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'API documentation',
    },
  },
  apis: [
    './src/attendance/*.swagger.ts',
    './src/auth/*.swagger.ts',
    './src/log/*.swagger.ts',
    './src/report/*.swagger.ts'
],
};

const swaggerSpec = swaggerJSDoc(options);

router.use('/', swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerSpec));

export default router;