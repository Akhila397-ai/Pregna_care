import "reflect-metadata";
import { Request, Response } from "express";
import type { IAUthService } from "../../../services/auth/interface/IAuth.service.js";
import { IAuthController } from "../interface/IAuth.controller.js";
export declare class AuthController implements IAuthController {
    private authService;
    constructor(authService: IAUthService);
    register: (req: Request, res: Response) => Promise<void>;
    verifyOtp: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    forgotPassword: (req: Request, res: Response) => Promise<void>;
    resetPassword: (req: Request, res: Response) => Promise<void>;
    resendOtp: (req: Request, res: Response) => Promise<void>;
    refreshToken: (req: Request, res: Response) => Promise<void>;
    setOnboarding: (req: Request, res: Response) => Promise<void>;
    getMe: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map