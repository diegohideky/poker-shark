// teams/requests/index.ts

import { NextApiResponse } from "next";
import { authMiddleware } from "@middleware/authMiddleware";
import dataSource from "@db/data-source";
import { TeamPlayer } from "@entities/TeamPlayer";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";
import { TeamPlayerStatus } from "@entities/TeamPlayer";
import { PaginationSchema, PostTeamRequestSchema } from "../../schema";
import { Role, RoleNames } from "@entities/Role";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const teamPlayerRepo = dataSource.getRepository(TeamPlayer);
  const roleRepo = dataSource.getRepository(Role);
  const { id: teamId } = req.query;

  if (req.method === "GET") {
    const parsed = PaginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }

    const {
      limit,
      offset,
      orderDirection = "DESC",
      orderField = "createdAt",
    } = parsed.data;

    try {
      const [requests, total] = await teamPlayerRepo.findAndCount({
        where: { teamId: teamId as string },
        skip: offset,
        take: limit,
        order: { [orderField]: orderDirection },
        relations: ["user"],
      });
      return res.status(200).json({ requests, total });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message || "Error fetching team requests." });
    }
  } else if (req.method === "POST") {
    try {
      const parsed = PostTeamRequestSchema.safeParse({ query: req.query });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
      }

      const existingRequest = await teamPlayerRepo.findOne({
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

      const newRequest = teamPlayerRepo.create({
        teamId: teamId as string,
        userId: req.user.id,
        roleId: playerRole?.id,
        status: TeamPlayerStatus.PENDING,
      });
      const savedRequest = await teamPlayerRepo.save(newRequest);

      return res.status(201).json(savedRequest);
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message || "Error requesting team access." });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

export default dbMiddleware(authMiddleware(handler));
