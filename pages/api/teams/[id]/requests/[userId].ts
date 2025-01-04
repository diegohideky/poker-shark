import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { TeamPlayer } from "@entities/TeamPlayer";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { TeamPlayerStatus } from "@entities/TeamPlayer";
import { PutTeamRequestSchema } from "../../schema";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const teamRepo = dataSource.getRepository(TeamPlayer);
  const { id: teamId, userId } = req.query;

  if (req.method === "PUT") {
    const { accept } = req.body;

    const parsed = PutTeamRequestSchema.safeParse({
      query: req.query,
      body: req.body,
    });

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }

    try {
      const teamPlayer = await teamRepo.findOne({
        where: { teamId: teamId as string, userId: userId as string },
      });

      if (!teamPlayer) {
        return res.status(404).json({ error: "Request not found." });
      }

      teamPlayer.status = accept
        ? TeamPlayerStatus.ACCEPTED
        : TeamPlayerStatus.DECLINED;

      const updatedTeamPlayer = await teamRepo.save(teamPlayer);
      return res.status(200).json(updatedTeamPlayer);
    } catch (error) {
      return res.status(500).json({ error: "Error updating request status." });
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
        methods: ["PUT", "DELETE"],
      },
      {
        role: "TEAM ADMIN",
        methods: ["PUT", "DELETE"],
      },
      {
        role: "PLAYER",
        methods: ["DELETE"],
      },
    ])(handler)
  )
);
