import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof SyntaxError && "body" in error && req.is("application/json")) {
    req.log?.warn(
      { correlationId: req.correlationId, err: error },
      "Invalid JSON payload"
    );

    return res.status(400).json({
      message: "Invalid JSON payload",
      correlationId: req.correlationId,
    });
  }

  if (error instanceof ZodError) {
    req.log?.warn(
      {
        correlationId: req.correlationId,
        issues: error.issues,
      },
      "Request validation failed"
    );

    return res.status(400).json({
      message: "Validation failed",
      issues: error.issues,
      correlationId: req.correlationId,
    });
  }

  const err =
    error instanceof Error
      ? error
      : new Error("An unexpected error occurred");

  req.log?.error(
    {
      correlationId: req.correlationId,
      err,
    },
    "Unhandled request error"
  );

  return res.status(500).json({
    message: "Internal server error",
    correlationId: req.correlationId,
    ...(env.isDev ? { detail: err.message } : {}),
  });
}