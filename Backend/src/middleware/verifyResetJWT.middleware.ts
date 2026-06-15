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


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: HttpResponse.RESET_TOKEN_MISSING,
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decodedRaw = jwt.decode(token);
   

    const decoded = jwt.verify(
      token,
      process.env.JWT_RESET_SECRET as string
    ) as ResetPayload;


    if (decoded.purpose !== "password-reset") {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: HttpResponse.INVALID_RESET_TOKEN,
      });
      return;
    }

    req.user = decoded;

    next();
  } catch (error) {

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