import jwt from "jsonwebtoken";

export const generateToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, name: user.name },
    process.env.JWT_SECRET, // This should be your secret key
    { expiresIn: "7d" } // Token expires in 7 days
  );

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
};
