import { DataSource } from "typeorm";
// import { User } from "./entity/User";
// import { Role } from "./entity/Role";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345678",
  database: "pokershark",
  //   entities: [User, Role],
  //   migrations: ["src/migration/**/*.ts"],
  //   seeds: ["src/seeds/**/*.ts"],
  synchronize: true, // Disable in production and use migrations instead
});
