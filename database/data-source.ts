import "reflect-metadata";
import { DataSource } from "typeorm";
import { Role } from "@entities/Role";
import { User } from "@entities/User";
import { UserRole } from "@entities/UserRole";

import dotenv from "dotenv";
import { Team } from "@entities/Team";
import { TeamPlayer } from "@entities/TeamPlayer";
import { Game } from "@entities/Game";

// Load environment variables from .env file
dotenv.config({ path: ".env.local" });

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Role, UserRole, Team, TeamPlayer, Game],
  migrations: ["dist/migrations/*.ts"],
  synchronize: false, // Disable in production and use migrations instead
  logging: true,
});

export default AppDataSource;
