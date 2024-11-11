import { NextApiResponse } from "next";
import { authMiddleware } from "@middleware/authMiddleware";
import { z } from "zod";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { AuthenticatedNextApiRequest } from "@middleware/types";
import dataSource from "@db/data-source";
import { TeamPlayer } from "@entities/TeamPlayer";

async function handler(req: AuthenticatedNextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = Object.assign({}, req.user);

    const teamPlayersRepo = dataSource.getRepository(TeamPlayer);

    const teamPlayers = await teamPlayersRepo.find({
      where: { userId: user.id },
    });

    user["teamPlayers"] = teamPlayers;

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Error getting current account",
      error: error instanceof z.ZodError ? error.errors : error.message,
    });
  }
}

export default dbMiddleware(authMiddleware(handler));
