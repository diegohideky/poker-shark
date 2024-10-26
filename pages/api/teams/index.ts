import { NextApiResponse } from "next";
import { Team } from "@entities/Team";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { FindTeamSchema, TeamSchema } from "./schema";
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
    const parsedQuery = FindTeamSchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return res.status(400).json({ error: parsedQuery.error });
    }

    const {
      offset = 0,
      limit = 10,
      search,
      orderField,
      orderDirection = "ASC",
    } = parsedQuery.data;

    try {
      const queryBuilder = teamRepo
        .createQueryBuilder("team")
        .where("team.deletedAt IS NULL");

      if (search) {
        queryBuilder.andWhere("team.name ILIKE :search", {
          search: `%${search}%`,
        });
      }

      if (orderField && orderDirection) {
        queryBuilder.orderBy(`team.${orderField}`, orderDirection);
      }

      queryBuilder.skip(offset).take(limit);

      const [teams, total] = await queryBuilder.getManyAndCount();

      return res.status(200).json({
        data: teams,
        total,
      });
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
