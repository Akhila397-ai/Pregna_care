import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { HttpStatus } from "../constants/status.constant.js";
import { HttpResponse } from "../constants/messages.constant.js";


interface ResetPayload {
    userId: string;
    purpose: string
}


export const verifyResetJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);
    console.log(
  "RESET SECRET LENGTH:",
  process.env.JWT_RESET_SECRET?.length
);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: HttpResponse.RESET_TOKEN_MISSING,
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN RECEIVED:", token);
    console.log(
      "VERIFY SECRET:",
      process.env.JWT_RESET_SECRET
    );

    // Decode without verifying (debug only)
    const decodedRaw = jwt.decode(token);
    console.log("DECODED RAW:", decodedRaw);

    const decoded = jwt.verify(
      token,
      process.env.JWT_RESET_SECRET as string
    ) as ResetPayload;

    console.log("VERIFIED PAYLOAD:", decoded);

    if (decoded.purpose !== "password-reset") {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: HttpResponse.INVALID_RESET_TOKEN,
      });
      return;
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error("RESET JWT ERROR:", error);

    if (error instanceof jwt.TokenExpiredError) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Reset token expired",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: error.message,
      });
      return;
    }

    res.status(HttpStatus.UNAUTHORIZED).json({
      message: "Invalid token",
    });
  }
};