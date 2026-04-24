import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "../utils/zod.js";

import { genreResponseSchema } from "../schemas/index.js";
import { errorResponseSchema } from "../schemas/commonSchemas.js";

export function registerGenreOpenApi(registry: OpenAPIRegistry): void {
  registry.register("GenreResponse", genreResponseSchema);

  registry.registerPath({
    method: "get",
    path: "/genres",
    tags: ["Genres"],
    summary: "Get genres",
    responses: {
      200: {
        description: "Genres retrieved successfully",
        content: {
          "application/json": {
            schema: z.array(genreResponseSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/genres/{id}",
    tags: ["Genres"],
    summary: "Get genre by id",
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
    responses: {
      200: {
        description: "Genre retrieved successfully",
        content: {
          "application/json": {
            schema: genreResponseSchema,
          },
        },
      },
      404: {
        description: "Genre not found",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
