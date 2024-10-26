import "reflect-metadata";
import { User } from "@entities/User";
import dataSource from "@db/data-source";
import { SignupSchema } from "./schema";
import { encryptPassword } from "@libs/password";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";
import { NextApiResponse } from "next";

async function signupHandler(req: UserNextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }

  const { username, password, passwordConfirmation } = parsed.data;

  if (password !== passwordConfirmation) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const userRepo = dataSource.getRepository(User);

    const existingUser = await userRepo.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await encryptPassword(password);

    const newUser = userRepo.create({
      username,
      password: hashedPassword,
    });

    await userRepo.save(newUser);

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default dbMiddleware(signupHandler);
