import fs from "fs";
import { NextApiResponse } from "next";
import { authMiddleware } from "@middleware/authMiddleware";
import { authorize } from "@middleware/authorize";
import dataSource from "@db/data-source";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";
import { uploadFileToS3 } from "@libs/uploader";
import { parseForm } from "@libs/formData";
import { User } from "@entities/User";

export const config = {
  api: {
    bodyParser: false, // Important to disable Next.js body parser
  },
};

async function handler(req: UserNextApiRequest, res: NextApiResponse) {
  const userRepo = dataSource.getRepository(User);

  if (req.method === "PATCH") {
    const { files } = await parseForm(req); // Await the promise
    const imageFile = files.photo ? files.photo[0] : null;

    if (!imageFile) {
      return res.status(400).json({ error: "Invalid image file" });
    }

    try {
      let photoUrl = "user-picture-default.avif";

      if (imageFile && imageFile.filepath) {
        const fileBuffer = await fs.promises.readFile(imageFile.filepath);
        const mimeType = imageFile.mimetype || "image/jpeg";
        photoUrl = await uploadFileToS3(
          fileBuffer,
          imageFile.originalFilename,
          mimeType
        );
      }

      const foundUser = await userRepo.findOneBy({
        id: req.user.id,
      });
      foundUser.photoUrl = photoUrl;
      await foundUser.save();

      return res.status(201).json(foundUser);
    } catch (error) {
      return res.status(500).json({ error: "Error creating user" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
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
        methods: ["PATCH"],
      },
      {
        role: "TEAM ADMIN",
        methods: ["PATCH"],
      },
      {
        role: "PLAYER",
        methods: ["PATCH"],
      },
    ])(handler)
  )
);
