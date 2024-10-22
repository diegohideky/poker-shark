import "reflect-metadata";
import { RoleSeeder } from "./RoleSeeder";
import { UserSeeder } from "./UserSeeder";
import AppDataSource from "@db/data-source";

const runSeeders = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected!");

    await RoleSeeder(AppDataSource);
    await UserSeeder(AppDataSource);

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await AppDataSource.destroy();
  }
};

runSeeders();
