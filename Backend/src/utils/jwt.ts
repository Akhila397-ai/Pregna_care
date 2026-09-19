import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { JWTPayload, UserRole } from "../types/roles.js";

export const generateAccessToken = (userId: string, role?: string): string => {
  const options: jwt.SignOptions = { expiresIn: "15m" };
  return jwt.sign({ userId, role: role as UserRole }, env.JWT_SECRET, options);
};

export const generateRefreshToken = (userId: string): string => {
  const options: jwt.SignOptions = { expiresIn: "7d" };
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, options);
};

export const generateResetToken = (userId: string): string => {
  const options: jwt.SignOptions = { expiresIn: "10m" };
  return jwt.sign(
    {
      userId,
      purpose: "password-reset",
    },
    env.JWT_RESET_SECRET,
    options
  );
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
};

export const verifyResetToken = (token: string): JWTPayload => {
  return jwt.verify(token, env.JWT_RESET_SECRET) as JWTPayload;
};
