import { Request, Response } from "express";
export interface IAdminController {
    getAllUsers(req: Request, res: Response): Promise<void>;
    blockUser(req: Request, res: Response): Promise<void>;
    unblockUser(req: Request, res: Response): Promise<void>;
    deleteUser(req: Request, res: Response): Promise<void>;
    getAllDoctors(req: Request, res: Response): Promise<void>;
    verifyDoctor(req: Request, res: Response): Promise<void>;
    approveDoctor(req: Request, res: Response): Promise<void>;
    rejectDoctor(req: Request, res: Response): Promise<void>;
    blockDoctor(req: Request, res: Response): Promise<void>;
    unblockDoctor(req: Request, res: Response): Promise<void>;
    deleteDoctor(req: Request, res: Response): Promise<void>;
    getDoctorDocumentUrl(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=IAdmin.controller.d.ts.map