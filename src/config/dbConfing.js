const pg = require("pg");
const { Pool } = pg;
const envVariables = require("../utils/envVariables");

const pool = new Pool({
  user: envVariables.DB_USER,
  host: envVariables.DB_HOST,
  port: envVariables.DB_PORT,
  password: envVariables.DB_PASSWORD,
  database: envVariables.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
