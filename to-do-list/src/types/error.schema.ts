import { z } from "zod";

export const validationErrorResponse = z.object({
  errorCode: z.literal("invalid/fields"),
  message: z.string(),
  errors: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});
export type ValidationErrorResponse = z.infer<typeof validationErrorResponse>;

export const resourceNotFoundErrorResponse = z.object({
  errorCode: z.string().regex(/^not_found\/.+/),
  message: z.string(),
});
export type ResourceNotFoundErrorResponse = z.infer<typeof resourceNotFoundErrorResponse>;

export const unauthenticatedErrorResponse = z.object({
  errorCode: z.literal("auth/unauthenticated"),
  message: z.string(),
});
export type UnauthenticatedErrorResponse = z.infer<typeof unauthenticatedErrorResponse>;

export const forbiddenErrorResponse = z.object({
  errorCode: z.literal("auth/forbidden"),
  message: z.string(),
});
export type ForbiddenErrorResponse = z.infer<typeof forbiddenErrorResponse>;
