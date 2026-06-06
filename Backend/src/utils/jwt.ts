import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign({ userId, role }, secret, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string) => {
  const secret = process.env.JWT_REFRESH_SECRET;

  console.log("USING REFRESH SECRET:", secret); // 🔥 debug

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is missing");
  }

  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

