// teams/requests/index.ts

import { NextApiResponse } from "next";
import { authMiddleware } from "@middleware/authMiddleware";
import dataSource from "@db/data-source";
import { TeamPlayer } from "@entities/TeamPlayer";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";
import { TeamPlayerStatus } from "@entities/TeamPlayer";
import { PostTeamRequestSchema } from "../../schema";
import { Role, RoleNames } from "@entities/Role";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const teamRepo = dataSource.getRepository(TeamPlayer);
  const roleRepo = dataSource.getRepository(Role);
  const { id: teamId } = req.query;

  if (req.method === "POST") {
    try {
      const parsed = PostTeamRequestSchema.safeParse({ query: req.query });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
      }

      const existingRequest = await teamRepo.findOne({
        where: { teamId: teamId as string, userId: req.user.id },
      });

      if (existingRequest) {
        return res
          .status(400)
          .json({ error: "You have already requested access to this team." });
      }

      const playerRole = await roleRepo.findOne({
        where: { name: RoleNames.PLAYER },
      });

      const newRequest = teamRepo.create({
        teamId: teamId as string,
        userId: req.user.id,
        roleId: playerRole?.id,
        status: TeamPlayerStatus.PENDING,
      });
      const savedRequest = await teamRepo.save(newRequest);

      return res.status(201).json(savedRequest);
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message || "Error requesting team access." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

export default dbMiddleware(authMiddleware(handler));
