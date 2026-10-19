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
    getVerifiedDoctors: (req: Request, res: Response) => Promise<void>;
    bookAppointment: (req: Request, res: Response) => Promise<void>;
    getPatientAppointments: (req: Request, res: Response) => Promise<void>;
    getDoctorAppointments: (req: Request, res: Response) => Promise<void>;
    completeAppointment: (req: Request, res: Response) => Promise<void>;
    cancelAppointment: (req: Request, res: Response) => Promise<void>;
    getPatientPrimaryDoctor: (req: Request, res: Response) => Promise<void>;
    requestPrimaryDoctor: (req: Request, res: Response) => Promise<void>;
    cancelPrimaryDoctorRequest: (req: Request, res: Response) => Promise<void>;
    removePrimaryDoctor: (req: Request, res: Response) => Promise<void>;
    getDoctorPrimaryRequests: (req: Request, res: Response) => Promise<void>;
    respondToPrimaryRequest: (req: Request, res: Response) => Promise<void>;
    submitDoctorReport: (req: Request, res: Response) => Promise<void>;
    getDoctorReports: (req: Request, res: Response) => Promise<void>;
    resolveDoctorReport: (req: Request, res: Response) => Promise<void>;
    private _handleError;
}
//# sourceMappingURL=doctor.controller.d.ts.map