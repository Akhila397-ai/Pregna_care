import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HttpStatus } from '../constants/status.constant.js';
import { HttpResponse } from '../constants/messages.constant.js';
import { logger } from '../shared/logger/logger.js';
import { AppError } from '../shared/errors/AppError.js';

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = req.id || 'N/A';
  const scopedLogger = req.id ? logger.withContext(req.id) : logger;

  scopedLogger.error(`[ErrorMiddleware] ${req.method} ${req.originalUrl}:`, err);

  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const firstErrorMessage = err.issues[0]?.message || 'Please check the entered information.';
    const formattedErrors: Record<string, string> = {};

    for (const issue of err.issues) {
      const path = issue.path.join('.');
      if (path && !formattedErrors[path]) {
        formattedErrors[path] = issue.message;
      }
    }

    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: firstErrorMessage,
      error: firstErrorMessage,
      errors: formattedErrors,
      requestId,
    });
    return;
  }

  // 2. Custom AppErrors (Operational Domain Errors)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.message,
      errors: err.errors,
      requestId,
    });
    return;
  }

  // 3. JWT Authentication Errors
  if (
    err instanceof Error &&
    (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')
  ) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: HttpResponse.TOKEN_EXPIRED,
      error: HttpResponse.TOKEN_EXPIRED,
      requestId,
    });
    return;
  }

  // 4. Mongo / Mongoose Duplicate Key Error
  if (typeof err === 'object' && err !== null && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0] || 'field';
    const message = `An account or record with this ${field} already exists.`;
    res.status(HttpStatus.CONFLICT).json({
      success: false,
      message,
      error: message,
      requestId,
    });
    return;
  }

  // 5. Standard Error with custom statusCode
  if (err instanceof Error) {
    const statusCode = (err as any).statusCode || HttpStatus.BAD_REQUEST;
    const isInternalTechnical =
      err.message.includes('ECONNREFUSED') ||
      err.message.includes('MongoServerError') ||
      err.message.includes('AWS') ||
      err.message.includes('credentials') ||
      err.message.includes('stack') ||
      err.message.includes('node_modules');

    const message = isInternalTechnical ? HttpResponse.SERVER_ERROR : err.message;

    res.status(statusCode).json({
      success: false,
      message,
      error: message,
      requestId,
    });
    return;
  }

  // 6. Fallback Internal Server Error
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: HttpResponse.SERVER_ERROR,
    error: HttpResponse.SERVER_ERROR,
    requestId,
  });
};