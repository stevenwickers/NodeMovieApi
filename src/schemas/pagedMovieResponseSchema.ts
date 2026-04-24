import { z } from "zod";
import { movieResponseSchema } from "./movieResponse.js";

export const pagedMovieResponseSchema = z.object({
  items: z.array(movieResponseSchema),
  page: z.number().int(),
  pageSize: z.number().int(),
  totalCount: z.number().int(),
  totalPages: z.number().int(),
  sortBy: z.string(),
  sortDirection: z.string(),
  usedDefaultSort: z.boolean(),
}).openapi("PagedMovieResponse");
