import { NextApiResponse } from "next";
import { Team } from "@entities/Team";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { UpdateTeamSchema } from "./schema";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const teamRepo = dataSource.getRepository(Team);
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const team = await teamRepo.findOne({ where: { id: id as string } });
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      return res.status(200).json(team);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching team" });
    }
  } else if (req.method === "PUT") {
    const parsedBody = UpdateTeamSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    try {
      const team = await teamRepo.findOne({ where: { id: id as string } });
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      if (parsedBody.data.name !== team.name) {
        const existingTeam = await teamRepo.findOne({
          where: { name: parsedBody.data.name },
        });

        if (existingTeam) {
          return res.status(400).json({ error: "Team already exists" });
        }
      }

      teamRepo.merge(team, parsedBody.data);
      const updatedTeam = await teamRepo.save(team);
      return res.status(200).json(updatedTeam);
    } catch (error) {
      return res.status(500).json({ error: "Error updating team" });
    }
  } else if (req.method === "DELETE") {
    try {
      const team = await teamRepo.findOne({ where: { id: id as string } });
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      await teamRepo.softRemove(team);
      return res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting team" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}

export default dbMiddleware(
  authMiddleware(authorize(["ADMIN", "TEAM ADMIN"])(handler))
);
