import { MatchPlayerStatus } from "@entities/MatchPlayer";
import { z } from "zod";

export const MatchPlayerSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  score: z.number().int().optional(), // Allow negative score
  position: z
    .number()
    .int()
    .min(1, "Position must be a positive integer")
    .optional(),
  status: z.enum(
    [
      MatchPlayerStatus.ENROLLED,
      MatchPlayerStatus.BUSTED,
      MatchPlayerStatus.FINISHED,
    ],
    {
      required_error: "Status is required",
    }
  ),
  rebuys: z.number().int().nonnegative().optional(),
  addons: z.number().int().nonnegative().optional(),
  stoppedAt: z.string().datetime().optional(),
});

export const MatchPlayerUpdateSchema = MatchPlayerSchema.partial();

export const PaginationSchema = z.object({
  offset: z.number().nonnegative().optional(),
  limit: z.number().positive().optional(),
  orderField: z.enum(["name", "type", "createdAt"]).optional(),
  orderDirection: z.enum(["ASC", "DESC"]).optional(),
  search: z.string().optional(),
});
