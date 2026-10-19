import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { HttpResponse } from "../constants/messages.constant.js";
import { HttpStatus } from "../constants/status.constant.js";
import { UserRole } from "../types/roles.js";

const extractToken = (req: Request): string | null => {
  return (
    req.cookies?.accessToken ||
    req.headers.authorization?.split(" ")[1] ||
    null
  );
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: HttpResponse.UNAUTHORIZED,
        error: HttpResponse.UNAUTHORIZED,
      });
      return;
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: HttpResponse.UNAUTHORIZED,
      error: HttpResponse.UNAUTHORIZED,
    });
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: HttpResponse.UNAUTHORIZED,
        error: HttpResponse.UNAUTHORIZED,
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      let message: string = HttpResponse.FORBIDDEN;
      if (roles.length === 1 && roles[0] === "doctor") {
        message = "This area is available only to verified doctors.";
      } else if (roles.length === 1 && roles[0] === "admin") {
        message = "You don't have permission to access this area.";
      }

      res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message,
        error: message,
      });
      return;
    }

    next();
  };
};

export const isUser = [authenticate, authorizeRoles("user")];
export const isAdmin = [authenticate, authorizeRoles("admin")];
export const isDoctor = [authenticate, authorizeRoles("doctor")];
export const isAdminOrDoctor = [authenticate, authorizeRoles("admin", "doctor")];
export const isAnyRole = [authenticate, authorizeRoles("user", "admin", "doctor")];