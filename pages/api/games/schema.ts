// schema.ts
import { z } from "zod";

export const GameSchema = z.object({
  name: z.string().min(1, "Game name is required"),
  type: z.enum(["CASH", "TOURNAMENT"], {
    required_error: "Game type is required",
    invalid_type_error: "Game type must be either CASH or TOURNAMENT",
  }),
});

export const GameUpdateSchema = GameSchema.partial();
export const PaginationSchema = z.object({
  offset: z.number().nonnegative().optional(),
  limit: z.number().positive().optional(),
  orderField: z.enum(["name", "type", "createdAt"]).optional(),
  orderDirection: z.enum(["ASC", "DESC"]).optional(),
  search: z.string().optional(),
});
