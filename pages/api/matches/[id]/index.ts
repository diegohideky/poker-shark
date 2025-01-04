import { NextApiResponse } from "next";
import { Match } from "@entities/Match";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { MatchUpdateSchema } from "../schema";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";
import { Game } from "@entities/Game";
import { Team } from "@entities/Team";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const matchRepo = dataSource.getRepository(Match);
  const matchId = req.query.id as string;

  if (req.method === "GET") {
    try {
      const match = await matchRepo.findOne({
        where: { id: matchId, deletedAt: null },
        relations: ["game"],
      });
      if (!match) return res.status(404).json({ error: "Match not found" });
      return res.status(200).json(match);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching match" });
    }
  } else if (req.method === "PUT") {
    const parsedBody = MatchUpdateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    try {
      const match = await matchRepo.findOne({ where: { id: matchId } });
      if (!match) return res.status(404).json({ error: "Match not found" });

      const [game, team] = await Promise.all([
        dataSource
          .getRepository(Game)
          .findOne({ where: { id: parsedBody.data.gameId } }),
        dataSource
          .getRepository(Team)
          .findOne({ where: { id: parsedBody.data.teamId } }),
      ]);

      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      matchRepo.merge(match, parsedBody.data);
      const updatedMatch = await matchRepo.save(match);
      return res.status(200).json(updatedMatch);
    } catch (error) {
      return res.status(500).json({ error: "Error updating match" });
    }
  } else if (req.method === "DELETE") {
    try {
      const match = await matchRepo.findOne({ where: { id: matchId } });
      if (!match) return res.status(404).json({ error: "Match not found" });

      await matchRepo.softRemove(match);
      return res.status(200).json({ message: "Match deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting match" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
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
        methods: ["GET", "PUT", "DELETE"],
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
