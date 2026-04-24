import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

import { env } from "./env.js";
import { genreNames } from "../schemas/index.js";
import {
  registerGenreOpenApi,
  registerMovieOpenApi,
  healthOpenApi,
} from "../openapi/index.js";

const registry = new OpenAPIRegistry();

registerMovieOpenApi(registry);
registerGenreOpenApi(registry);
healthOpenApi(registry);

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Node Movie API",
    version: "1.0.0",
    description: "A Node.js movie API backed by PostgreSQL stored functions.",
  },
  servers: [
    {
      url: `http://localhost:${env.port}`,
      description: "Local development server",
    },
  ],
});

const movieGetParameters = openApiDocument.paths?.["/movies"]?.get?.parameters;
const genresParameter = movieGetParameters?.find(
  (parameter): parameter is typeof parameter & { name: string; schema?: unknown; style?: string; explode?: boolean } =>
    "name" in parameter && parameter.name === "genres"
);

if (genresParameter) {
  genresParameter.schema = {
    type: "array",
    items: {
      type: "string",
      enum: [...genreNames],
    },
    description: "Genre filter. Can be repeated in query string.",
  };
  genresParameter.style = "form";
  genresParameter.explode = true;
}
