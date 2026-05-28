const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Budget App API Documentation",
    description:
      "Production-ready interactive API Documentation for the Budget Application Backend.",
    version: "1.0.0",
  },
  host: "localhost:3000",
  basePath: "/api",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description:
        "Enter your JWT Access Token in the format: Bearer <token>",
    },
  },
};

const outputFile = "./swagger-output.json";
// app.js has all the routes mounted via app.use('/api', ...)
const endpointsFiles = ["./app.js"];

/* NOTE: If you run this script, it will generate/update the swagger-output.json file */
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("🚀 Swagger JSON documentation generated successfully!");
});
