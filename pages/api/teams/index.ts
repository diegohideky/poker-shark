import { NextApiResponse } from "next";
import { Team } from "@entities/Team";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { TeamSchema } from "./schema";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const teamRepo = dataSource.getRepository(Team);

  if (req.method === "POST") {
    const parsedBody = TeamSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    const { name, photoUrl } = parsedBody.data;

    try {
      const existingTeam = await teamRepo.findOne({ where: { name } });
      if (existingTeam) {
        return res.status(400).json({ error: "Team already exists" });
      }

      const newTeam = teamRepo.create({
        name,
        ownerId: req.user.id,
        photoUrl,
      });
      const savedTeam = await teamRepo.save(newTeam);
      return res.status(201).json(savedTeam);
    } catch (error) {
      return res.status(500).json({ error: "Error creating team" });
    }
  } else if (req.method === "GET") {
    try {
      const teams = await teamRepo.find();
      return res.status(200).json(teams);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching teams" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}

export default dbMiddleware(
  authMiddleware(authorize(["ADMIN", "TEAM ADMIN"])(handler))
);
