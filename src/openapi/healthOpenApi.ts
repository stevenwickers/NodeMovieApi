import { z } from "../utils/zod.js";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export function healthOpenApi(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: "get",
    path: "/health",
    tags: ["Health"],
    summary: "Health check",
    responses: {
      200: {
        description: "API is healthy",
        content: {
          "application/json": {
            schema: z.object({
              status: z.string(),
            }),
          },
        },
      },
    },
  });
}