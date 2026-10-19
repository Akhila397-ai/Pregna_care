import { DoctorApplicationDocument, DoctorApplicationWithUser } from "../types/doctor.js";
import { DoctorApplicationDTO, DoctorDashboardDTO, DoctorStatusResponseDTO, VerifiedDoctorDTO } from "../dtos/doctor.dto.js";
type PresignedUrls = {
    profileImage?: string;
    degreeCertificateUrl?: string;
    registrationCertificateUrl?: string;
    governmentIdUrl?: string;
};
export declare const toDoctorApplicationDTO: (app: DoctorApplicationDocument, presignedUrls?: PresignedUrls) => DoctorApplicationDTO;
export declare const toDoctorDashboardDTO: ({ application, user }: DoctorApplicationWithUser, presignedUrls?: PresignedUrls) => DoctorDashboardDTO;
export declare const toDoctorStatusDTO: ({ application, user }: DoctorApplicationWithUser, presignedUrls?: PresignedUrls) => DoctorStatusResponseDTO;
export declare const toVerifiedDoctorDTO: ({ application, user }: DoctorApplicationWithUser, profileImageUrl?: string) => VerifiedDoctorDTO;
export declare const toAppointmentDTO: (doc: any) => any;
export declare const toPrimaryDoctorRelationshipDTO: (doc: any) => any;
export declare const toDoctorReportDTO: (doc: any) => any;
export {};
//# sourceMappingURL=doctor.mapper.d.ts.map