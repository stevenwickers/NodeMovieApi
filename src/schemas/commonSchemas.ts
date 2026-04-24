import { z } from "../utils/zod.js";

export const errorResponseSchema = z.object({
  message: z.string(),
  correlationId: z.string().optional(),
});

export const validationIssueSchema = z.object({
  code: z.string().optional(),
  path: z.array(z.union([z.string(), z.number()])),
  message: z.string(),
});

export const validationErrorResponseSchema = z.object({
  message: z.string(),
  correlationId: z.string().optional(),
  issues: z.array(validationIssueSchema).optional(),
});

export const idResponseSchema = z.object({
  id: z.string().uuid(),
});