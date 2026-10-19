import { IDoctorReportDocument, DoctorReportReason } from "../../../models/doctorReport.model.js";
export interface CreateDoctorReportData {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    reason: DoctorReportReason;
    description: string;
}
export interface IDoctorReportRepository {
    createReport(data: CreateDoctorReportData): Promise<IDoctorReportDocument>;
    findAllReports(status?: string): Promise<IDoctorReportDocument[]>;
    findReportById(reportId: string): Promise<IDoctorReportDocument | null>;
    findReportsByPatientId(patientId: string): Promise<IDoctorReportDocument[]>;
    resolveReport(reportId: string, adminRemarks: string, adminUserId: string): Promise<IDoctorReportDocument | null>;
}
//# sourceMappingURL=IDoctorReport.repository.d.ts.map