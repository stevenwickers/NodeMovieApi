import { z } from "../utils/zod.js";

export const genreResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export type GenreResponse = z.infer<typeof genreResponseSchema>;
