import 'reflect-metadata';
import { Request, Response } from 'express';
import type { IDoctorService } from '../../../services/doctor/interface/IDoctor.service.js';
import type { IDoctorController } from '../interface/IDoctor.controller.js';
export declare class DoctorController implements IDoctorController {
    private doctorService;
    constructor(doctorService: IDoctorService);
    apply: (req: Request, res: Response) => Promise<void>;
    getMyStatus: (req: Request, res: Response) => Promise<void>;
    getMyDashboard: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=doctor.controller.d.ts.map