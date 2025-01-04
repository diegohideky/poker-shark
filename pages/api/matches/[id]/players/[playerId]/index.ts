// matches/[id]/players/[playerId].ts
import { NextApiResponse } from "next";
import { MatchPlayer } from "@entities/MatchPlayer";
import { Match } from "@entities/Match";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { MatchPlayerUpdateSchema } from "../schema";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";
import { adjustPlayerPositions } from "..";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const matchPlayerRepo = dataSource.getRepository(MatchPlayer);
  const matchRepo = dataSource.getRepository(Match);
  const matchId = req.query.id;
  const playerId = req.query.playerId;

  // Fetch match and game information
  const match = await matchRepo.findOne({
    where: { id: String(matchId) },
    relations: ["game"],
  });
  if (!match) return res.status(404).json({ error: "Match not found" });

  const isCashGame = match.game.type === "CASH";

  if (req.method === "PUT") {
    const parsedBody = MatchPlayerUpdateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    const { score, position, status, rebuys, addons, stoppedAt } =
      parsedBody.data;

    try {
      const player = await matchPlayerRepo.findOne({
        where: { matchId: String(matchId), userId: String(playerId) },
      });
      if (!player)
        return res.status(404).json({ error: "Player not found in match" });

      // Update fields based on the request
      if (score !== undefined && isCashGame) player.score = score;
      if (position !== undefined) player.position = position; // Always update position
      if (status) player.status = status;
      if (rebuys !== undefined) player.rebuys = rebuys;
      if (addons !== undefined) player.addons = addons;
      if (stoppedAt !== undefined) player.stoppedAt = new Date(stoppedAt);

      const updatedPlayer = await matchPlayerRepo.save(player);

      // Adjust positions if it's a cash game
      if (isCashGame) {
        await adjustPlayerPositions(matchId, matchPlayerRepo);
      }

      return res.status(200).json(updatedPlayer);
    } catch (error) {
      return res.status(500).json({ error: "Error updating player in match" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

export default dbMiddleware(
  authMiddleware(
    authorize([
      {
        role: "ADMIN",
        methods: ["PUT"],
      },
      {
        role: "TEAM ADMIN",
        methods: ["PUT"],
      },
    ])(handler)
  )
);
