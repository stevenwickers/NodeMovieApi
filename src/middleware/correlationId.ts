import crypto from "crypto";

export function correlationIdMiddleware(req:any, res:any, next:any) {
  const headerName = "x-correlation-id";
  const incoming = req.headers[headerName];

  const correlationId =
    typeof incoming === "string" && incoming.trim()
      ? incoming
      : crypto.randomUUID();

  req.correlationId = correlationId;
  res.setHeader(headerName, correlationId);

  next();
}