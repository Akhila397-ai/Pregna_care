import { Request, Response } from "express";

export interface IDoctorController {
    apply(req: Request, res: Response): Promise<void>;
    getMyStatus(req: Request, res: Response): Promise<void>;
    getMyDashboard(req: Request, res: Response): Promise<void>;
    getVerifiedDoctors(req: Request, res: Response): Promise<void>;

    // Appointments
    bookAppointment(req: Request, res: Response): Promise<void>;
    getPatientAppointments(req: Request, res: Response): Promise<void>;
    getDoctorAppointments(req: Request, res: Response): Promise<void>;
    completeAppointment(req: Request, res: Response): Promise<void>;
    cancelAppointment(req: Request, res: Response): Promise<void>;

    // Primary Doctor Relationships
    getPatientPrimaryDoctor(req: Request, res: Response): Promise<void>;
    requestPrimaryDoctor(req: Request, res: Response): Promise<void>;
    cancelPrimaryDoctorRequest(req: Request, res: Response): Promise<void>;
    removePrimaryDoctor(req: Request, res: Response): Promise<void>;
    getDoctorPrimaryRequests(req: Request, res: Response): Promise<void>;
    respondToPrimaryRequest(req: Request, res: Response): Promise<void>;

    // Reporting
    submitDoctorReport(req: Request, res: Response): Promise<void>;
    getDoctorReports(req: Request, res: Response): Promise<void>;
    resolveDoctorReport(req: Request, res: Response): Promise<void>;
}