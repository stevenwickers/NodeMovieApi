import { z } from "../utils/zod.js";
import { genreNameSchema } from "./genreName.js";

export const moviePatchRequestSchema = z
  .object({
    movieName: z.string().min(1).max(200).nullable().optional(),
    releaseDate: z.string().date().nullable().optional(),
    worldwideGross: z.number().nullable().optional(),
    productionBudget: z.number().nullable().optional(),
    domesticGross: z.number().nullable().optional(),
    genres: z.array(genreNameSchema.nullable()).nullable().optional(),
    genreNames: z.array(genreNameSchema.nullable()).nullable().optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field must be supplied for a patch request."
  )
  .refine(
    (value) => value.genres === undefined || value.genreNames === undefined,
    "Use either genres or genreNames, not both."
  );

export type MoviePatchRequest = z.infer<typeof moviePatchRequestSchema>;
