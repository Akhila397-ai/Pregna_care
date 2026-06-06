import { Request, Response } from "express";

export interface IAuthController {
    regiter(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;

}