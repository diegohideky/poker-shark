// games/[id].ts
import { NextApiResponse } from "next";
import { Game } from "@entities/Game";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { GameUpdateSchema } from "./schema";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const gameRepo = dataSource.getRepository(Game);

  if (req.method === "GET") {
    try {
      const game = await gameRepo.findOne({ where: { id: String(id) } });
      if (!game) return res.status(404).json({ error: "Game not found" });
      return res.status(200).json(game);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching game" });
    }
  } else if (req.method === "PUT") {
    const parsedBody = GameUpdateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    try {
      const game = await gameRepo.findOne({ where: { id: String(id) } });
      if (!game) return res.status(404).json({ error: "Game not found" });

      gameRepo.merge(game, parsedBody.data);
      const updatedGame = await gameRepo.save(game);
      return res.status(200).json(updatedGame);
    } catch (error) {
      return res.status(500).json({ error: "Error updating game" });
    }
  } else if (req.method === "DELETE") {
    try {
      const game = await gameRepo.findOne({ where: { id: String(id) } });
      if (!game) return res.status(404).json({ error: "Game not found" });

      await gameRepo.softDelete(id as string);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: "Error deleting game" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}

export default dbMiddleware(authMiddleware(authorize(["ADMIN"])(handler)));
