import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Odin Book API",
      version: "1.0.0",
      description: "REST API untuk Odin Book",
    },

    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

       schemas: {
    User: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        firstName: {
          type: "string",
        },
        lastName: {
          type: "string",
        },
        username: {
          type: "string",
        },
        email: {
          type: "string",
        },
        avatar: {
          type: "string",
        },
        bio: {
          type: "string",
        },
      },
    },

    Post: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        content: {
          type: "string",
        },
        image: {
          type: "string",
        },
        createdAt: {
          type: "string",
          format: "date-time",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
        },
      },
    },

    Comment: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        content: {
          type: "string",
        },
        createdAt: {
          type: "string",
          format: "date-time",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
        },
      },
    },

    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          example: "ricky@example.com",
        },
        password: {
          type: "string",
          example: "password123",
        },
      },
    },

    RegisterRequest: {
      type: "object",
      required: [
        "firstName",
        "lastName",
        "username",
        "email",
        "password",
      ],
      properties: {
        firstName: {
          type: "string",
          example: "Ricky",
        },
        lastName: {
          type: "string",
          example: "Silaban",
        },
        username: {
          type: "string",
          example: "ricky97",
        },
        email: {
          type: "string",
          example: "ricky@example.com",
        },
        password: {
          type: "string",
          example: "password123",
        },
      },
    },

    ErrorResponse: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
          example: false,
        },
        message: {
          type: "string",
          example: "Terjadi kesalahan.",
        },
      },
    },
  },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);