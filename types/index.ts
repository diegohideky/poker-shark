import { User } from "@entities/User";
import { NextApiRequest } from "next";

export type UserNextApiRequest = NextApiRequest & { user: User };
