const app = require("./app");
const envVariables = require("./src/utils/envVariables");
const initializeDatabase = require("./src/config/dbInit");

// Auto-initialize database schema if tables don't exist
initializeDatabase();

app.listen(envVariables.PORT, () => {
  console.log(`Server running on port ${envVariables.PORT}`);
  console.log(`Swagger documentation: http://localhost:${envVariables.PORT}/api-docs/`);
});
