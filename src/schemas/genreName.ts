import { z } from "../utils/zod.js";

export const genreNames = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
] as const;

export const genreNameSchema = z.enum(genreNames);

export type GenreName = z.infer<typeof genreNameSchema>;
