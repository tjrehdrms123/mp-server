const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "ABM API",
      version: "1.0.0",
      description: "A B M",
    },
    host: "dev.abm-korea.com",
    basePath: "/",
    servers: [{ url: "https://dev.abm-korea.com" }],
  },
  apis: ["./routes/*.js", "./swagger_modules/*"],
};

const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
