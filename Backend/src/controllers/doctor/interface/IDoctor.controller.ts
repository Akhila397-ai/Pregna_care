import { Request, Response } from "express";

export interface IDoctorController {
    apply(req: Request, res: Response): Promise<void>;
    getMyApplication(req: Request, res: Response): Promise<void>;
    getMyProfile(req: Request, res: Response):  Promise<void>;
}