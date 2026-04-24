import { Pool } from "pg";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const pool = new Pool({
  connectionString: env.postgresConnectionString,
});

pool.on("connect", () => {
  logger.info("PostgreSQL connection established");
});

pool.on("error", (err) => {
  logger.error({ err }, "Unexpected PostgreSQL pool error");
});