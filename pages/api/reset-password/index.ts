import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@entities/User";
import dataSource from "@db/data-source"; // Data source import for TypeORM
import { authorize } from "@middleware/authorize";
import { generateRandomPassword, encryptPassword } from "@libs/password"; // Assuming you placed password generation and hashing in a utils file
import { authMiddleware } from "@middleware/authMiddleware";
import { resetPasswordSchema } from "./schema";
import dbConnect from "@db/dbConnect";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const connection = await dbConnect();

  try {
    // Validate the request body
    const parsedData = resetPasswordSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res
        .status(400)
        .json({ message: parsedData.error.errors[0].message });
    }

    const { username } = parsedData.data;

    const userRepo = dataSource.getRepository(User);

    // Find the user by username
    const user = await userRepo.findOne({
      where: { username, deletedAt: null },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new random password
    const newPassword = generateRandomPassword();

    // Hash the new password
    const hashedPassword = await encryptPassword(newPassword);

    // Update user's password
    user.password = hashedPassword;
    await userRepo.save(user);

    // Send the new password as a response
    return res
      .status(200)
      .json({ message: "Password reset successfully", newPassword });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  } finally {
    await connection.destroy();
  }
}

export default authMiddleware(authorize(["ADMIN"])(handler));
