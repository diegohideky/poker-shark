import fs from "fs";
import { NextApiResponse } from "next";
import { Team } from "@entities/Team";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { FindTeamSchema, TeamSchema } from "./schema";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";
import { uploadFileToS3 } from "@libs/uploader";
import { parseForm } from "@libs/formData";
import { generateUniquePageNames } from "@libs/utils";

export const config = {
  api: {
    bodyParser: false, // Important to disable Next.js body parser
  },
};

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const teamRepo = dataSource.getRepository(Team);

  if (req.method === "POST") {
    const { fields, files } = await parseForm(req); // Await the promise
    const name = fields.name ?? fields.name[0];
    const pageName = fields.pageName ?? fields.pageName[0];
    const imageFile = files.photo ?? files.photo[0];

    const parsedBody = TeamSchema.safeParse({ name, pageName });
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    const { name: teamName, pageName: teamPageName } = parsedBody.data;

    try {
      console.log("teamPageName", teamPageName);
      const existingTeamByName = await teamRepo.findOne({
        where: { name: teamName },
      });
      if (existingTeamByName) {
        return res.status(400).json({ error: "Team already exists" });
      }

      const existingTeamByPageName = await teamRepo.findOne({
        where: { pageName: teamPageName },
      });
      if (existingTeamByPageName) {
        const suggestions = await generateUniquePageNames(teamName, teamRepo);
        return res.status(400).json({
          suggestions,
          error: "Team with this page name already exists",
        });
      }

      let photoUrl = "shield-default.jpeg";

      if (imageFile && imageFile.filepath) {
        const fileBuffer = await fs.promises.readFile(imageFile.filepath);
        const mimeType = imageFile.mimetype || "image/jpeg";
        photoUrl = await uploadFileToS3(
          fileBuffer,
          imageFile.originalFilename,
          mimeType
        );
      }

      const newTeam = teamRepo.create({
        name: teamName,
        pageName: teamPageName,
        photoUrl,
        ownerId: req.user.id,
      });
      const savedTeam = await teamRepo.save(newTeam);

      return res.status(201).json(savedTeam);
    } catch (error) {
      return res.status(500).json({ error: "Error creating team" });
    }
  } else if (req.method === "GET") {
    const parsedQuery = FindTeamSchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return res.status(400).json({ error: parsedQuery.error });
    }

    const {
      offset = 0,
      limit = 10,
      search,
      orderField,
      orderDirection = "ASC",
    } = parsedQuery.data;

    try {
      const queryBuilder = teamRepo
        .createQueryBuilder("team")
        .where("team.deletedAt IS NULL");

      if (search) {
        queryBuilder.andWhere("team.name ILIKE :search", {
          search: `%${search}%`,
        });
      }

      if (orderField && orderDirection) {
        queryBuilder.orderBy(`team.${orderField}`, orderDirection);
      }

      queryBuilder.skip(offset).take(limit);

      const [teams, total] = await queryBuilder.getManyAndCount();

      return res.status(200).json({
        data: teams,
        total,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error fetching teams" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}

export default dbMiddleware(
  authMiddleware(authorize(["ADMIN", "TEAM ADMIN", "PLAYER"])(handler))
);
