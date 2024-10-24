import { User } from "@entities/User";
import dbConnect from "@db/dbConnect";
import dataSource from "@db/data-source";
import { generateToken } from "@libs/jwt";
import { validatePassword } from "@libs/password";
import { LoginSchema } from "./schema";

export default async function loginHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const connection = await dbConnect();

  try {
    const userRepo = dataSource.getRepository(User);

    // Validate the request body using Zod schema
    const parsed = LoginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { username, password } = parsed.data;

    // Find the user by username
    const user = await userRepo.findOneBy({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await validatePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await connection.destroy();
  }
}
