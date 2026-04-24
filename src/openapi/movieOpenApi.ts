import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "../utils/zod.js";
import { moviePatchRequestSchema, movieRequestSchema, movieResponseSchema, movieQuerySchema, pagedMovieResponseSchema } from "../schemas/index.js";
import {
  errorResponseSchema,
  validationErrorResponseSchema,
  idResponseSchema,
} from "../schemas/commonSchemas.js";

export function registerMovieOpenApi(registry: OpenAPIRegistry): void {
  registry.register("MovieRequest", movieRequestSchema);
  registry.register("MoviePatchRequest", moviePatchRequestSchema);
  registry.register("MovieResponse", movieResponseSchema);
  registry.register("ErrorResponse", errorResponseSchema);
  registry.register("ValidationErrorResponse", validationErrorResponseSchema);
  registry.register("IdResponse", idResponseSchema);

  registry.registerPath({
    method: "get",
    path: "/movies",
    tags: ["Movies"],
    summary: "Get movies",
    description: `
Retrieve movies with optional search, filtering, sorting, and pagination.
`,
    request: {
      query: movieQuerySchema,
    },
    responses: {
      200: {
        description: "Movies retrieved successfully",
        content: {
          "application/json": {
            schema: pagedMovieResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/movies/{id}",
    tags: ["Movies"],
    summary: "Get movie by id",
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
    responses: {
      200: {
        description: "Movie retrieved successfully",
        content: {
          "application/json": {
            schema: movieResponseSchema,
          },
        },
      },
      404: {
        description: "Movie not found",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/movies",
    tags: ["Movies"],
    summary: "Create a movie",
    request: {
      body: {
        description: "Movie data to create",
        required: true,
        content: {
          "application/json": {
            schema: movieRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Movie created successfully",
        headers: {
          Location: {
            description: "URL of the created movie resource",
            schema: {
              type: "string",
            },
          },
        },
        content: {
          "application/json": {
            schema: idResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid request",
        content: {
          "application/json": {
            schema: validationErrorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/movies/{id}",
    tags: ["Movies"],
    summary: "Update a movie",
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
      body: {
        description: "Updated movie data",
        required: true,
        content: {
          "application/json": {
            schema: movieRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Movie updated successfully",
        content: {
          "application/json": {
            schema: movieResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid request",
        content: {
          "application/json": {
            schema: validationErrorResponseSchema,
          },
        },
      },
      404: {
        description: "Movie not found",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/movies/{id}",
    tags: ["Movies"],
    summary: "Patch a movie",
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
      body: {
        description: "Partial movie data to update",
        required: true,
        content: {
          "application/json": {
            schema: moviePatchRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Movie patched successfully",
        content: {
          "application/json": {
            schema: movieResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid request",
        content: {
          "application/json": {
            schema: validationErrorResponseSchema,
          },
        },
      },
      404: {
        description: "Movie not found",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/movies/{id}",
    tags: ["Movies"],
    summary: "Delete a movie",
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
    responses: {
      204: {
        description: "Movie deleted successfully",
      },
      404: {
        description: "Movie not found",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
