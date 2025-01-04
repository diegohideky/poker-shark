import { User } from "@entities/User";
import { NextApiHandler } from "next";

export const authorize =
  (authorizations: { role: string; methods: string[] }[]) =>
  (handler: NextApiHandler) =>
  (req, res) => {
    const user: User = req.user; // Assuming the user is set in req by authMiddleware

    if (!user || !user.userRoles) {
      return res.status(403).json({ message: "Access denied. Invalid role" });
    }

    const methodsAllowed = authorizations.reduce((acc, prev) => {
      const { role, methods } = prev;
      if (user.userRoles.find((userRole) => userRole.role.name === role)) {
        acc = [...acc, ...methods];
      }
      return acc;
    }, []);

    if (!methodsAllowed.includes(req.method)) {
      return res.status(403).json({ message: "Access denied. Invalid method" });
    }

    return handler(req, res);
  };
