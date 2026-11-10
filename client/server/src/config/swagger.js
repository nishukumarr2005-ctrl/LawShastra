import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LawShastra API',
      version: '1.0.0',
      description: 'API documentation for the LawShastra legal learning platform',
    },
    servers: [{ url: 'http://localhost:5000/api/v1' }],
  },
  apis: ['./src/routes/*.js'],
}

export const swaggerSpec = swaggerJSDoc(options)
