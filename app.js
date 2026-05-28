const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const routers = require("./src/router/routers");
const { apiLimiter } = require("./src/middleware/rateLimiter");
const errorHandler = require("./src/middleware/errorHandler");
const apiLogger = require("./src/middleware/apiLogger");

// Swagger documentation
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

// Enable GZIP compression and Helmet security headers
app.use(helmet());
app.use(compression());

// Strict Production-Ready CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", apiLogger, apiLimiter, routers);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
