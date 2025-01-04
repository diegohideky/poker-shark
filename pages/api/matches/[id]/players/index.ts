import { NextApiResponse } from "next";
import { MatchPlayer, MatchPlayerStatus } from "@entities/MatchPlayer";
import { Match } from "@entities/Match";
import { GameTypes } from "@entities/Game";
import dataSource from "@db/data-source";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import { MatchPlayerSchema, PaginationSchema } from "./schema";
import { UserNextApiRequest } from "types";
import { TeamPlayer, TeamPlayerStatus } from "@entities/TeamPlayer";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const matchPlayerRepo = dataSource.getRepository(MatchPlayer);
  const matchRepo = dataSource.getRepository(Match);
  const teamPlayerRepo = dataSource.getRepository(TeamPlayer);
  const matchId = req.query.id;

  // Fetch match and game information
  const match = await matchRepo.findOne({
    where: { id: String(matchId) },
    relations: ["game"],
  });
  if (!match) return res.status(404).json({ error: "Match not found" });

  const isCashGame = match.game.type === GameTypes.CASH;
  const isTournamentGame = match.game.type === GameTypes.TOURNAMENT;

  if (req.method === "POST") {
    const parsedBody = MatchPlayerSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    const {
      userId,
      score = 0,
      position,
      status = MatchPlayerStatus.ENROLLED,
      rebuys = 0,
      addons = 0,
      stoppedAt,
    } = parsedBody.data;

    const matchPlayer = await matchPlayerRepo.findOne({
      where: { matchId: String(matchId), userId },
    });

    if (matchPlayer) {
      return res.status(400).json({ error: "Player already exists in match" });
    }

    try {
      const newPlayer = matchPlayerRepo.create({
        matchId: String(matchId),
        userId,
        score,
        position: isTournamentGame ? position : null,
        status,
        rebuys,
        addons,
        stoppedAt,
      });

      const savedPlayer = await matchPlayerRepo.save(newPlayer);

      if (isCashGame) {
        await adjustPlayerPositions(matchId, matchPlayerRepo);
      }

      return res.status(201).json(savedPlayer);
    } catch (error) {
      return res.status(500).json({ error: "Error adding player to match" });
    }
  } else if (req.method === "GET") {
    const query = PaginationSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error });
    }

    const {
      offset = 0,
      limit = 10,
      // orderField = "name",
      // orderDirection = "ASC",
    } = query.data;

    try {
      const teamPlayers = await teamPlayerRepo
        .createQueryBuilder("tp")
        .innerJoinAndSelect("tp.user", "u")
        .leftJoinAndSelect(
          MatchPlayer,
          "mp",
          'mp."userId" = u.id AND mp."matchId" = :matchId',
          { matchId }
        )
        .where("tp.teamId = :teamId", { teamId: match.teamId })
        .andWhere('tp."status" = :status', {
          status: TeamPlayerStatus.ACCEPTED,
        })
        .skip(offset)
        .take(limit)
        .select([
          'tp.id as "teamPlayerId"',
          'u.id AS "userId"',
          'u.name AS "name"',
          'u.photoUrl AS "photoUrl"',
          'u.username AS "username"',
          'u.pix AS "pix"',
          'mp.id AS "matchPlayerId"',
          'mp.score AS "score"',
          'mp.position AS "position"',
          'mp.status AS "status"',
        ])
        .orderBy({
          "mp.position": "ASC",
          "u.name": "ASC",
        })
        .getRawMany();

      const totalCount = await teamPlayerRepo
        .createQueryBuilder("tp")
        .where('tp."teamId" = :teamId', { teamId: match.teamId })
        .getCount();

      const formattedPlayers = teamPlayers.map((row: any) => ({
        id: row.teamPlayerId,
        user: row.userId
          ? {
              id: row.userId,
              name: row.name,
              username: row.username,
              photoUrl: row.photoUrl,
              pix: row.pix,
            }
          : null,
        matchPlayer: row.matchPlayerId
          ? {
              id: row.matchPlayerId,
              score: row.score,
              position: row.position,
              status: row.status,
            }
          : null,
      }));

      return res
        .status(200)
        .json({ total: totalCount, data: formattedPlayers });
    } catch (error) {
      return res.status(500).json({ error: "Error fetching players" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

// Function to adjust player positions based on score for cash games
export async function adjustPlayerPositions(matchId, matchPlayerRepo) {
  const players = await matchPlayerRepo.find({
    where: { matchId: String(matchId) },
    select: ["id", "position"],
    order: { score: "DESC" },
  });

  players.forEach((player, index) => {
    player.position = index + 1;
  });

  await matchPlayerRepo.save(players);
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
        methods: ["GET", "POST"],
      },
      {
        role: "PLAYER",
        methods: ["GET"],
      },
    ])(handler)
  )
);
