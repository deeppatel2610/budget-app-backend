const app = require("./app");
const envVariables = require("./src/utils/envVariables");

app.listen(envVariables.PORT, () => {
  console.log(`Server running on port ${envVariables.PORT}`);
  console.log(`Swagger documentation: http://localhost:${envVariables.PORT}/api-docs/`);
});
