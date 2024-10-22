import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../entities/User"; // Check if this alias is correct in your config
import dbConnect from "../../../database/dbConnect";
import dataSource from "../../../database/data-source";
import bcrypt from "bcryptjs"; // For password encryption
import { signupSchema } from "./schema";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }

  const { username, password } = parsed.data;

  try {
    const connection = await dbConnect();
    const userRepo = await dataSource.getRepository(User);

    // Check if the user already exists
    const existingUser = await userRepo.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = userRepo.create({
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await userRepo.save(newUser);

    // Close the connection
    await connection.destroy();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
