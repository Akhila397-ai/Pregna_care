import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/roles.js";
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
export declare const authorizeRoles: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const isUser: ((req: Request, res: Response, next: NextFunction) => void)[];
export declare const isAdmin: ((req: Request, res: Response, next: NextFunction) => void)[];
export declare const isDoctor: ((req: Request, res: Response, next: NextFunction) => void)[];
export declare const isAdminOrDoctor: ((req: Request, res: Response, next: NextFunction) => void)[];
export declare const isAnyRole: ((req: Request, res: Response, next: NextFunction) => void)[];
//# sourceMappingURL=auth.middleware.d.ts.map