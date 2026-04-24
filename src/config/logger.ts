import pino from "pino";
import { env } from "./env.js";

export const logger = pino({
  level: env.isDev ? "debug" : "info",
  ...(env.isDev
    ? {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname,req,res,responseTime",
        },
      },
    }
    : {}),
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});