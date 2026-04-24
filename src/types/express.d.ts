import type { Logger } from "pino";

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      log?: Logger;
    }
  }
}

export {};