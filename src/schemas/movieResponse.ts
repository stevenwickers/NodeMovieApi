import { z } from '../utils/zod.js';

export const movieResponseSchema = z.object({
  id: z.string().uuid(),
  movieName: z.string(),
  releaseDate: z.string(),
  worldwideGross: z.number().nullable(),
  productionBudget: z.number().nullable(),
  domesticGross: z.number().nullable(),
  genres: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type MovieResponse = z.infer<typeof movieResponseSchema>
