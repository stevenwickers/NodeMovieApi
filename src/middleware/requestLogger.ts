import pinoHttpImport from "pino-http";
import { logger } from "../config/logger.js";

const pinoHttp = (pinoHttpImport as unknown as typeof import("pino-http").default);

export const requestLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req: any): boolean => {
      const url = req.url ?? "";
      return url.startsWith("/swagger") || url === "/" || url === "/favicon.ico";
    },
  },
  customLogLevel(
    _req: any,
    res: any,
    err: any
  ): "silent" | "info" | "warn" | "error" {
    if (res.statusCode === 304) return "silent";
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customProps(req: any, res: any): Record<string, unknown> {
    return {
      correlationId: req.correlationId,
      method: req.method,
      path: req.originalUrl ?? req.url,
      statusCode: res.statusCode,
    };
  },
  customSuccessMessage(req: any, res: any): string {
    return `${req.method} ${req.url} -> ${res.statusCode}`;
  },
  customErrorMessage(req: any, res: any, err: any): string {
    return err
      ? `${req.method} ${req.url} -> ${res.statusCode} (${err.message})`
      : `${req.method} ${req.url} -> ${res.statusCode}`;
  },
});