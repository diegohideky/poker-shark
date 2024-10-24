// middleware/authMiddlewareTypes.ts
import { NextApiRequest } from "next";

export interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: {
    id: string;
    username: string;
    roles: string[]; // Add other fields as needed
  };
}
