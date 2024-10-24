import { User } from "@entities/User";
import { NextApiHandler } from "next";

export const authorize =
  (roles: string[]) => (handler: NextApiHandler) => (req, res) => {
    const user: User = req.user; // Assuming the user is set in req by authMiddleware

    if (
      !user ||
      !user.userRoles ||
      !user.userRoles.some((userRole) => roles.includes(userRole.role.name))
    ) {
      return res.status(403).json({ message: "Access denied. Invalid role" });
    }

    return handler(req, res);
  };
