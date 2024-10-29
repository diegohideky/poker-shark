import { NextApiResponse } from "next";
import { Match } from "@entities/Match";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { MatchSchema, MatchPaginationSchema } from "./schema";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";
import { Brackets } from "typeorm";
import { Game } from "@entities/Game";
import { Team } from "@entities/Team";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const matchRepo = dataSource.getRepository(Match);

  if (req.method === "POST") {
    const parsedBody = MatchSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    const { name, gameId, datetime, teamId } = parsedBody.data;

    const [game, team] = await Promise.all([
      dataSource.getRepository(Game).findOne({ where: { id: gameId } }),
      dataSource.getRepository(Team).findOne({ where: { id: teamId } }),
    ]);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    try {
      const newMatch = matchRepo.create({
        name: name || `Poker Table ${new Date().toISOString().split("T")[0]}`,
        gameId,
        datetime,
        teamId,
      });
      const savedMatch = await matchRepo.save(newMatch);
      return res.status(201).json(savedMatch);
    } catch (error) {
      return res.status(500).json({ error: "Error creating match" });
    }
  } else if (req.method === "GET") {
    const query = MatchPaginationSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }

    const {
      offset = 0,
      limit = 10,
      search,
      orderField = "createdAt",
      orderDirection = "ASC",
    } = query.data;

    try {
      const queryBuilder = matchRepo
        .createQueryBuilder("match")
        .where("match.deletedAt IS NULL")
        .skip(offset)
        .take(limit)
        .orderBy(
          `match.${orderField}`,
          orderDirection.toUpperCase() as "ASC" | "DESC"
        );

      if (search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("match.name ILIKE :search", { search: `%${search}%` });
          })
        );
      }

      const [matches, total] = await queryBuilder.getManyAndCount();
      return res.status(200).json({ data: matches, total });
    } catch (error) {
      return res.status(500).json({ error: "Error fetching matches" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}

export default dbMiddleware(authMiddleware(authorize(["ADMIN"])(handler)));
