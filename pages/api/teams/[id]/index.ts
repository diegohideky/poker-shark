import fs from "fs";
import { NextApiResponse } from "next";
import { Team } from "@entities/Team";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { UpdateTeamSchema } from "../schema";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";
import { parseForm } from "@libs/formData";
import { generateUniquePageNames } from "@libs/utils";
import { uploadFileToS3 } from "@libs/uploader";

export const config = {
  api: {
    bodyParser: false, // Important to disable Next.js body parser
  },
};

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const teamRepo = dataSource.getRepository(Team);
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const team = await teamRepo.findOne({ where: { id: id as string } });
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      return res.status(200).json(team);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching team" });
    }
  } else if (req.method === "PUT") {
    const { fields, files } = await parseForm(req); // Await the promise
    const name = fields.name ? fields.name[0] : null;
    const pageName = fields.pageName ? fields.pageName[0] : null;
    const imageFile = files.photo ? files.photo[0] : null;

    const parsedBody = UpdateTeamSchema.safeParse({
      name,
      pageName,
    });
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    try {
      const team = await teamRepo.findOne({ where: { id: id as string } });
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      const existingTeamByName = await teamRepo.findOne({
        where: { name: parsedBody.data.name },
      });

      if (existingTeamByName && existingTeamByName.id !== team.id) {
        return res
          .status(400)
          .json({ error: "Another team already have this name" });
      }

      const existingTeamByPageName = await teamRepo.findOne({
        where: { pageName: parsedBody.data.pageName },
      });
      if (existingTeamByPageName && existingTeamByPageName.id !== team.id) {
        const suggestions = await generateUniquePageNames(
          req.body.name,
          teamRepo
        );
        return res.status(400).json({
          error: "Another team already have this page name",
          suggestions,
        });
      }

      const teamData = {
        ...parsedBody.data,
        photoUrl: team.photoUrl,
      };

      if (imageFile && imageFile.filepath) {
        const fileBuffer = await fs.promises.readFile(imageFile.filepath);
        const mimeType = imageFile.mimetype || "image/jpeg";
        teamData.photoUrl = await uploadFileToS3(
          fileBuffer,
          imageFile.originalFilename,
          mimeType
        );
      }

      teamRepo.merge(team, teamData);
      const updatedTeam = await teamRepo.save(team);
      return res.status(200).json(updatedTeam);
    } catch (error) {
      return res.status(500).json({ error: "Error updating team" });
    }
  } else if (req.method === "DELETE") {
    try {
      const team = await teamRepo.findOne({ where: { id: id as string } });
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      await teamRepo.softRemove(team);
      return res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting team" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}

export default dbMiddleware(
  authMiddleware(authorize(["ADMIN", "TEAM ADMIN"])(handler))
);
