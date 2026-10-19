import { DoctorApplyDTO, DoctorApplyResponseDTO, DoctorStatusResponseDTO, DoctorDashboardDTO, GetVerifiedDoctorsResponseDTO, BookAppointmentDTO, AppointmentDTO, CompleteAppointmentDTO, CancelAppointmentDTO, PatientPrimaryDoctorStatusDTO, PrimaryDoctorRelationshipDTO, RespondPrimaryDoctorRequestDTO, SubmitDoctorReportDTO, DoctorReportDTO } from "../../../dtos/doctor.dto.js";
import { UploadFiles } from "../implementation/doctor.service.js";
export interface IDoctorService {
    apply(userId: string, data: DoctorApplyDTO, files: UploadFiles): Promise<DoctorApplyResponseDTO>;
    getMyStatus(userId: string): Promise<DoctorStatusResponseDTO>;
    getMyDashboard(userId: string): Promise<DoctorDashboardDTO>;
    getVerifiedDoctors(): Promise<GetVerifiedDoctorsResponseDTO>;
    bookAppointment(patientId: string, data: BookAppointmentDTO): Promise<AppointmentDTO>;
    getPatientAppointments(patientId: string): Promise<AppointmentDTO[]>;
    getDoctorAppointments(doctorId: string): Promise<AppointmentDTO[]>;
    completeAppointment(doctorId: string, appointmentId: string, data: CompleteAppointmentDTO): Promise<AppointmentDTO>;
    cancelAppointment(userId: string, appointmentId: string, data: CancelAppointmentDTO): Promise<AppointmentDTO>;
    getPatientPrimaryDoctor(patientId: string): Promise<PatientPrimaryDoctorStatusDTO>;
    requestPrimaryDoctor(patientId: string, doctorId: string): Promise<PrimaryDoctorRelationshipDTO>;
    cancelPrimaryDoctorRequest(patientId: string): Promise<{
        message: string;
    }>;
    removePrimaryDoctor(patientId: string): Promise<{
        message: string;
    }>;
    getDoctorPrimaryRequests(doctorId: string): Promise<PrimaryDoctorRelationshipDTO[]>;
    respondToPrimaryRequest(doctorId: string, requestId: string, data: RespondPrimaryDoctorRequestDTO): Promise<PrimaryDoctorRelationshipDTO>;
    submitDoctorReport(patientId: string, data: SubmitDoctorReportDTO): Promise<DoctorReportDTO>;
    getDoctorReports(status?: string): Promise<DoctorReportDTO[]>;
    resolveDoctorReport(reportId: string, adminRemarks: string, adminUserId: string): Promise<DoctorReportDTO>;
}
//# sourceMappingURL=IDoctor.service.d.ts.map