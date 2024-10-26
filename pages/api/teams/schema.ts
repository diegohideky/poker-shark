import { z } from "zod";

export const TeamSchema = z.object({
  name: z.string().min(1),
  photoUrl: z.string().url().optional(),
});

export const UpdateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  photoUrl: z.string().url().optional(),
});
