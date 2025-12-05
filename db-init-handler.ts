import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

interface LambdaEvent {
  action: "init" | "seed";
}

interface LambdaResponse {
  statusCode: number;
  body: string;
}

export const handler = async (event: LambdaEvent): Promise<LambdaResponse> => {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false // Required for RDS
    }
  });

  try {
    if (event.action === "init") {
      // Execute DDL script
      const ddlScript = readFileSync(
        join(__dirname, "database/ddl/database creation.sql"),
        "utf-8"
      );

      await pool.query(ddlScript);
      console.log("Database schema created successfully");
    }

    if (event.action === "seed") {
      // Execute DML script
      const dmlScript = readFileSync(
        join(__dirname, "database/dml/role and onboarding.sql"),
        "utf-8"
      );

      await pool.query(dmlScript);
      console.log("Database seeded successfully");
    }

    await pool.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Database ${event.action} completed successfully`,
      }),
    };
  } catch (error) {
    console.error("Database initialization error:", error);
    await pool.end();

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Database initialization failed",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
