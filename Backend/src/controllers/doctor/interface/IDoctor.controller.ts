import { Request, Response } from "express";

export interface IDoctorController {
    apply(req: Request, res: Response): Promise<void>;
    getMyStatus(req: Request, res: Response): Promise<void>;
    getMyDashboard(req: Request, res: Response): Promise<void>;
}