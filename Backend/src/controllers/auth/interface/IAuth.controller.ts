import { Request, Response } from "express";

export interface IAuthController {
    register(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
    setOnboarding(req: Request, res: Response): Promise<void>;
    getMe(req: Request, res: Response): Promise<void>;
    setPregnancyLMP(req: Request, res: Response): Promise<void>;
    getPregnancyDetails(req: Request, res: Response): Promise<void>;
    setCycleInfo(req: Request, res: Response): Promise<void>;
    getCycleDetails(req: Request, res: Response): Promise<void>;
    getEmergencyContacts(req: Request, res: Response): Promise<void>;
    addEmergencyContact(req: Request, res: Response): Promise<void>;
    updateEmergencyContact(req: Request, res: Response): Promise<void>;
    deleteEmergencyContact(req: Request, res: Response): Promise<void>;
}