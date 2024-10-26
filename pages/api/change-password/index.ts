import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@entities/User";
import { authMiddleware } from "@middleware/authMiddleware";
import dataSource from "@db/data-source";
import { validatePassword, encryptPassword } from "@libs/password"; // Assuming you have password comparison and encryption utilities
import { z } from "zod";
import { ChangePasswordSchema } from "./schema";
import { dbMiddleware } from "@middleware/dbMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, currentPassword, newPassword, passwordConfirmation } =
      ChangePasswordSchema.parse(req.body);

    if (newPassword !== passwordConfirmation) {
      return res
        .status(400)
        .json({ message: "New password and confirmation do not match" });
    }

    const userRepo = dataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await validatePassword(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await encryptPassword(newPassword);

    user.password = hashedNewPassword;
    await userRepo.save(user);

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error changing password",
      error: error instanceof z.ZodError ? error.errors : error.message,
    });
  }
}

export default dbMiddleware(authMiddleware(handler));
