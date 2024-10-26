import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@entities/User";
import dataSource from "@db/data-source";
import { authorize } from "@middleware/authorize";
import { generateRandomPassword, encryptPassword } from "@libs/password";
import { authMiddleware } from "@middleware/authMiddleware";
import { ResetPasswordSchema } from "./schema";
import { dbMiddleware } from "@middleware/dbMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const parsedData = ResetPasswordSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res
        .status(400)
        .json({ message: parsedData.error.errors[0].message });
    }

    const { username } = parsedData.data;

    const userRepo = dataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { username, deletedAt: null },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPassword = generateRandomPassword();

    const hashedPassword = await encryptPassword(newPassword);

    user.password = hashedPassword;
    await userRepo.save(user);

    return res
      .status(200)
      .json({ message: "Password reset successfully", newPassword });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
}

export default dbMiddleware(authMiddleware(authorize(["ADMIN"])(handler)));
