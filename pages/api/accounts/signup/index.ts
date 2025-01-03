import "reflect-metadata";
import { User } from "@entities/User";
import dataSource from "@db/data-source";
import { SignupSchema } from "./schema";
import { encryptPassword } from "@libs/password";
import { dbMiddleware } from "@middleware/dbMiddleware";
import { UserNextApiRequest } from "types";
import { NextApiResponse } from "next";
import { Role, RoleNames } from "@entities/Role";
import { UserRole } from "@entities/UserRole";

async function signupHandler(req: UserNextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors });
  }

  const { name, username, password, passwordConfirmation } = parsed.data;

  if (password !== passwordConfirmation) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);
    const userRoleRepo = dataSource.getRepository(UserRole);

    const existingUser = await userRepo.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const playerRole = await roleRepo.findOne({
      where: { name: RoleNames.PLAYER },
    });

    const hashedPassword = await encryptPassword(password);

    const newUser = userRepo.create({
      name,
      username,
      password: hashedPassword,
      photoUrl: "user-picture-default.avif",
    });

    const user = await userRepo.save(newUser);
    await userRoleRepo
      .createQueryBuilder()
      .insert()
      .into(UserRole)
      .values({
        userId: user.id,
        roleId: playerRole.id,
      })
      .execute();

    return res
      .status(201)
      .json({ id: user.id, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default dbMiddleware(signupHandler);
