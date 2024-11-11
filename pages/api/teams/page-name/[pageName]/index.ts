import { NextApiResponse } from "next";
import { Team } from "@entities/Team";
import dataSource from "@db/data-source";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const teamRepo = dataSource.getRepository(Team);

  if (req.method === "GET") {
    const { pageName } = req.query;
    try {
      const team = await teamRepo.findOne({
        where: { pageName: pageName as string },
      });

      return res.status(200).json(team);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching teams" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}

export default dbMiddleware(handler);
