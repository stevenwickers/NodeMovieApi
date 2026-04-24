import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { genreNameSchema } from "./genreName.js";

extendZodWithOpenApi(z);

export const movieQuerySchema = z.object({
  search: z.string().optional().openapi({
    description: "Search term for movie title",
  }),
  searchMode: z
    .enum(["general", "starts", "ends", "contains"])
    .optional()
    .openapi({
      description: "Search mode",
    }),
  page: z.coerce.number().int().positive().optional().openapi({
    description: "Page number (1-based)",
  }),
  pageSize: z.coerce.number().int().positive().optional().openapi({
    description: "Number of items per page",
  }),
  sortBy: z
    .enum([
      "id",
      "movie_name",
      "release_date",
      "worldwide_gross",
      "production_budget",
      "domestic_gross",
      "created_at",
      "updated_at",
    ])
    .optional()
    .openapi({
      description: "Column to sort by",
    }),
  sortDirection: z.enum(["asc", "desc", "ASC", "DESC"]).optional().openapi({
    description: "Sort direction",
  }),
  releaseDateFrom: z.string().date().optional().openapi({
    description: "Minimum release date",
  }),
  releaseDateTo: z.string().date().optional().openapi({
    description: "Maximum release date",
  }),
  worldwideGrossMin: z.coerce.number().optional().openapi({
    description: "Minimum worldwide gross",
  }),
  worldwideGrossMax: z.coerce.number().optional().openapi({
    description: "Maximum worldwide gross",
  }),
  productionBudgetMin: z.coerce.number().optional().openapi({
    description: "Minimum production budget",
  }),
  productionBudgetMax: z.coerce.number().optional().openapi({
    description: "Maximum production budget",
  }),
  domesticGrossMin: z.coerce.number().optional().openapi({
    description: "Minimum domestic gross",
  }),
  domesticGrossMax: z.coerce.number().optional().openapi({
    description: "Maximum domestic gross",
  }),
  genres: z.array(genreNameSchema).optional().openapi({
    description: "Genre filter. Can be repeated in query string.",
  }),
}).openapi("MovieQuery");
