import 'reflect-metadata';
import type { IDoctorRepository } from '../../../repositories/doctor/interface/IDoctor.repository.js';
import type { IUserRepository } from '../../../repositories/auth/interface/IUser.repository.js';
import type { IAppointmentRepository } from '../../../repositories/appointment/interface/IAppointment.repository.js';
import type { IPrimaryDoctorRepository } from '../../../repositories/primaryDoctor/interface/IPrimaryDoctor.repository.js';
import type { IDoctorReportRepository } from '../../../repositories/doctorReport/interface/IDoctorReport.repository.js';
import type { IDoctorService } from '../interface/IDoctor.service.js';
import { DoctorApplyDTO, DoctorDashboardDTO, GetVerifiedDoctorsResponseDTO, BookAppointmentDTO, AppointmentDTO, CompleteAppointmentDTO, CancelAppointmentDTO, PatientPrimaryDoctorStatusDTO, PrimaryDoctorRelationshipDTO, RespondPrimaryDoctorRequestDTO, SubmitDoctorReportDTO, DoctorReportDTO } from '../../../dtos/doctor.dto.js';
export interface UploadFiles {
    profileImage?: Express.Multer.File[];
    degreeCertificate?: Express.Multer.File[];
    registrationCertificate?: Express.Multer.File[];
    governmentId?: Express.Multer.File[];
}
export declare class DoctorService implements IDoctorService {
    private doctorRepository;
    private userRepository;
    private appointmentRepository;
    private primaryDoctorRepository;
    private doctorReportRepository;
    constructor(doctorRepository: IDoctorRepository, userRepository: IUserRepository, appointmentRepository: IAppointmentRepository, primaryDoctorRepository: IPrimaryDoctorRepository, doctorReportRepository: IDoctorReportRepository);
    apply(userId: string, data: DoctorApplyDTO, files: {
        [field: string]: Express.Multer.File[];
    }): Promise<{
        message: "Your doctor application has been submitted and is awaiting review.";
        application: import("../../../dtos/doctor.dto.js").DoctorApplicationDTO;
    }>;
    getMyStatus(userId: string): Promise<import("../../../dtos/doctor.dto.js").DoctorStatusResponseDTO>;
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
    private _resolvePresignedUrls;
}
//# sourceMappingURL=doctor.service.d.ts.map