import { z } from "zod";

export const TeamSchema = z.object({
  name: z.string().min(1),
  pageName: z
    .string()
    .min(1, "Page name is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Page name must only contain lowercase letters, numbers, and dashes"
    ),
});

export const UpdateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  pageName: z
    .string()
    .min(1, "Page name is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Page name must only contain lowercase letters, numbers, and dashes"
    ),
});

export const FindTeamSchema = z.object({
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 0)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  search: z.string().optional(),
  orderField: z.enum(["name", "createdAt", "updatedAt"]).optional(),
  orderDirection: z.enum(["ASC", "DESC"]).optional(),
});

export const PostTeamRequestSchema = z.object({
  query: z.object({
    id: z.string().uuid("Invalid team ID format"), // `teamId` must be a valid UUID
  }),
});

export const PutTeamRequestSchema = z.object({
  query: z.object({
    id: z.string().uuid("Invalid team ID format"),
    userId: z.string().uuid("Invalid user ID format"),
  }),
  body: z.object({
    accept: z.boolean({ required_error: "'accept' is required" }),
  }),
});

export const PaginationSchema = z.object({
  offset: z.number().nonnegative().optional(),
  limit: z.number().positive().optional(),
  orderField: z.enum(["name", "type", "createdAt"]).optional(),
  orderDirection: z.enum(["ASC", "DESC"]).optional(),
  search: z.string().optional(),
});
