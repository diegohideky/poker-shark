// games/index.ts
import { NextApiResponse } from "next";
import { Game } from "@entities/Game";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { GameSchema, PaginationSchema } from "./schema";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";
import { Brackets } from "typeorm";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const gameRepo = dataSource.getRepository(Game);

  if (req.method === "POST") {
    const parsedBody = GameSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    const { name, type } = parsedBody.data;

    try {
      const existingGame = await gameRepo.findOne({ where: { name, type } });
      if (existingGame) {
        return res.status(400).json({ error: "Game already exists" });
      }

      const newGame = gameRepo.create({ name, type });
      const savedGame = await gameRepo.save(newGame);
      return res.status(201).json(savedGame);
    } catch (error) {
      return res.status(500).json({ error: "Error creating game" });
    }
  } else if (req.method === "GET") {
    const query = PaginationSchema.safeParse(req.query);
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
      const queryBuilder = gameRepo
        .createQueryBuilder("game")
        .where("game.deletedAt IS NULL")
        .skip(offset)
        .take(limit)
        .orderBy(
          `game.${orderField}`,
          orderDirection.toUpperCase() as "ASC" | "DESC"
        );

      if (search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("game.name ILIKE :search", {
              search: `%${search}%`,
            }).orWhere("game.type ILIKE :search", { search: `%${search}%` });
          })
        );
      }

      const [games, total] = await queryBuilder.getManyAndCount();
      return res.status(200).json({ data: games, total });
    } catch (error) {
      return res.status(500).json({ error: "Error fetching games" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}

export default dbMiddleware(
  authMiddleware(
    authorize([
      {
        role: "ADMIN",
        methods: ["GET", "POST"],
      },
      {
        role: "TEAM ADMIN",
        methods: ["GET"],
      },
      {
        role: "PLAYER",
        methods: ["GET"],
      },
    ])(handler)
  )
);
