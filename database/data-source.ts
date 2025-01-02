import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Role } from "@entities/Role";
import { User } from "@entities/User";
import { UserRole } from "@entities/UserRole";
import { Team } from "@entities/Team";
import { TeamPlayer } from "@entities/TeamPlayer";
import { Game } from "@entities/Game";
import { Match } from "@entities/Match";
import { MatchPlayer } from "@entities/MatchPlayer";

// Load environment variables from .env file
dotenv.config({ path: ".env.local" });

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Role, UserRole, Team, TeamPlayer, Game, Match, MatchPlayer],
  migrations: ["dist/migrations/*.ts"],
  synchronize: false, // Disable in production and use migrations instead
  logging: false,
});

export default AppDataSource;
