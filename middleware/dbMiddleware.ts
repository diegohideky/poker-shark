import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import dbConnect from "@db/dbConnect"; // Your database connection logic here

export const dbMiddleware = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    let connection = null;
    try {
      connection = await dbConnect();
      await handler(req, res);
    } catch (error) {
      console.error("Database error:", error);
    } finally {
      if (connection) await connection.destroy();
    }
  };
};
