import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5001),
  CORS_ALLOW_ORIGINS: z.string().default("*"),
  POSTGRES_CONNECTION_STRING: z.string().min(1, "POSTGRES_CONNECTION_STRING is required"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:", result.error.flatten().fieldErrors);
  process.exit(1);
}

const parsed = result.data;

const corsAllowOrigins =
  parsed.CORS_ALLOW_ORIGINS === "*"
    ? "*"
    : parsed.CORS_ALLOW_ORIGINS.split(",").map((origin) => origin.trim());

export const env = {
  nodeEnv: parsed.NODE_ENV,
  port: parsed.PORT,
  corsAllowOrigins,
  postgresConnectionString: parsed.POSTGRES_CONNECTION_STRING,

  isDev: parsed.NODE_ENV === "development",
  isTest: parsed.NODE_ENV === "test",
  isProd: parsed.NODE_ENV === "production",
} as const;