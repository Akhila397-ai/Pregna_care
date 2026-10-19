import { IDoctorReportDocument } from "../../../models/doctorReport.model.js";
import { CreateDoctorReportData, IDoctorReportRepository } from "../interface/IDoctorReport.repository.js";
export declare class DoctorReportRepository implements IDoctorReportRepository {
    createReport(data: CreateDoctorReportData): Promise<IDoctorReportDocument>;
    findAllReports(status?: string): Promise<IDoctorReportDocument[]>;
    findReportById(reportId: string): Promise<IDoctorReportDocument | null>;
    findReportsByPatientId(patientId: string): Promise<IDoctorReportDocument[]>;
    resolveReport(reportId: string, adminRemarks: string, adminUserId: string): Promise<IDoctorReportDocument | null>;
}
//# sourceMappingURL=doctorReport.repository.d.ts.map