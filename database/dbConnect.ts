import "reflect-metadata";
import AppDataSource from "./data-source";

let connection = null;

const dbConnect = async () => {
  if (AppDataSource.isInitialized) {
    return connection;
  }
  try {
    connection = await AppDataSource.initialize();
    return connection;
  } catch (error) {
    console.error("Error during Data Source initialization", error);
    throw error;
  }
};

export default dbConnect;
