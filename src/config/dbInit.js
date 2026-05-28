const fs = require("fs");
const path = require("path");
const pool = require("./dbConfing");

const initializeDatabase = async () => {
  try {
    console.log("Checking database schema status...");
    
    // Check if the 'users' table exists
    const checkRes = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    const tablesExist = checkRes.rows[0].exists;

    if (!tablesExist) {
      console.log("Database schema not found. Initializing schema tables and default seeding...");
      
      const schemaPath = path.join(__dirname, "../../schema.sql");
      let schemaSql = fs.readFileSync(schemaPath, "utf8");

      // Strip out command-line CLI commands like 'CREATE DATABASE' and '\c'
      schemaSql = schemaSql
        .split("\n")
        .filter((line) => {
          const trimmed = line.trim();
          return !trimmed.startsWith("CREATE DATABASE") && !trimmed.startsWith("\\c");
        })
        .join("\n");

      // Execute schema queries
      await pool.query(schemaSql);
      console.log("✅ Database schema initialized and pre-seeded successfully!");
    } else {
      console.log("✅ Database schema is already up to date.");
    }
  } catch (err) {
    console.error("❌ Failed to initialize database:", err.message);
  }
};

module.exports = initializeDatabase;
