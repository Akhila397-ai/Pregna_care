import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../constants/status.constant.js";
import { HttpResponse } from "../constants/messages.constant.js";
import { logger } from "../shared/logger/logger.js";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`[ErrorMiddleware] ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof Error) {
    const statusCode = (err as any).statusCode || HttpStatus.BAD_REQUEST;
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: HttpResponse.SERVER_ERROR,
  });
};