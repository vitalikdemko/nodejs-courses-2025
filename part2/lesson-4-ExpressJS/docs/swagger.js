import swaggerJSDoc from 'swagger-jsdoc';

export const jsdocSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Coffee Brew API', version: '1.0'},
  },
  apis: ['./routes/**/*.js']
});