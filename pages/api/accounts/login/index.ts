import { User } from "@entities/User";
import dataSource from "@db/data-source";
import { generateToken } from "@libs/jwt";
import { validatePassword } from "@libs/password";
import { LoginSchema } from "./schema";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { NextApiRequest, NextApiResponse } from "next";

async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userRepo = dataSource.getRepository(User);

    const parsed = LoginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { username, password } = parsed.data;

    const user = await userRepo.findOneBy({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await validatePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = generateToken(user);

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default dbMiddleware(loginHandler);
