import { NextApiResponse, NextApiHandler } from "next";
import { verifyToken } from "@libs/jwt";
import dataSource from "@db/data-source"; // Your data source connection
import { User } from "@entities/User";
import { AuthenticatedNextApiRequest } from "./types"; // Define this if needed for typed request

export const authMiddleware = (handler: NextApiHandler) => {
  return async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized, token is missing" });
    }

    const token = authHeader.split("Bearer ")[1];

    try {
      const decoded = verifyToken(token);

      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: decoded.id },
        relations: ["userRoles", "userRoles.role"], // Assuming you have these relations in the User entity
      });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized, user not found" });
      }

      delete user.password;

      req.user = {
        ...user,
        roles: user.userRoles.map((userRole) => userRole.role.name), // Extract role names
      };

      return handler(req, res);
    } catch (err) {
      console.error({ err });
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
