import { z } from '../utils/zod.js';
import { genreNameSchema } from "./genreName.js";

/**
 * Validation schema (runtime)
 */
export const movieRequestSchema = z.object({
  movieName: z.string().min(1).max(200),
  releaseDate: z.string().min(1),
  worldwideGross: z.number().nullable().optional(),
  productionBudget: z.number().nullable().optional(),
  domesticGross: z.number().nullable().optional(),
  genres: z.array(genreNameSchema).optional(),
})

/**
 * Type (compile-time)
 */
export type MovieRequest = z.infer<typeof movieRequestSchema>
