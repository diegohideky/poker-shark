import { z } from "zod";

export const MatchSchema = z.object({
  name: z.string().optional(),
  gameId: z.string().uuid("Invalid game ID"),
  datetime: z.preprocess((val) => new Date(val as string), z.date()),
  teamId: z.string().uuid("Invalid team ID"),
});

export const MatchUpdateSchema = MatchSchema.partial();

export const MatchPaginationSchema = z.object({
  offset: z.number().nonnegative().optional(),
  limit: z.number().positive().optional(),
  orderField: z.enum(["name", "datetime", "createdAt"]).optional(),
  orderDirection: z.enum(["ASC", "DESC"]).optional(),
  search: z.string().optional(),
});