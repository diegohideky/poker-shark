import { NextApiResponse } from "next";
import { UserNextApiRequest } from "types";
import dataSource from "@db/data-source";
import { MatchPlayer } from "@entities/MatchPlayer";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.user.id; // Retrieve user ID from the request (authentication middleware should set this)
    const { teamId, gameId, offset = 0, limit = 10 } = req.query;

    const matchPlayerRepository = dataSource.getRepository(MatchPlayer);

    // Build the query with optional filters
    const query = matchPlayerRepository
      .createQueryBuilder("matchPlayer")
      .leftJoinAndSelect("matchPlayer.match", "match")
      .leftJoinAndSelect("match.game", "game")
      .leftJoinAndSelect("match.team", "team")
      .where("matchPlayer.userId = :userId", { userId });

    if (teamId) {
      query.andWhere("match.teamId = :teamId", { teamId });
    }

    if (gameId) {
      query.andWhere("match.gameId = :gameId", { gameId });
    }

    query
      .orderBy("match.datetime", "ASC")
      .skip(Number(offset))
      .take(Number(limit));

    const [data, total] = await query.getManyAndCount();

    return res.status(200).json({
      total,
      offset: Number(offset),
      limit: Number(limit),
      data,
    });
  } catch (error) {
    console.error("Error fetching user match history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default dbMiddleware(
  authMiddleware(
    authorize([
      {
        role: "ADMIN",
        methods: ["GET"],
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
