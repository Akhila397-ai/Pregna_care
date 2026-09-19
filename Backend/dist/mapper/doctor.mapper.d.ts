import { DoctorApplicationDocument, DoctorApplicationWithUser } from "../types/doctor.js";
import { DoctorApplicationDTO, DoctorDashboardDTO, DoctorStatusResponseDTO } from "../dtos/doctor.dto.js";
type PresignedUrls = {
    profileImage?: string;
    degreeCertificateUrl?: string;
    registrationCertificateUrl?: string;
    governmentIdUrl?: string;
};
export declare const toDoctorApplicationDTO: (app: DoctorApplicationDocument, presignedUrls?: PresignedUrls) => DoctorApplicationDTO;
export declare const toDoctorDashboardDTO: ({ application, user }: DoctorApplicationWithUser, presignedUrls?: PresignedUrls) => DoctorDashboardDTO;
export declare const toDoctorStatusDTO: ({ application, user }: DoctorApplicationWithUser, presignedUrls?: PresignedUrls) => DoctorStatusResponseDTO;
export {};
//# sourceMappingURL=doctor.mapper.d.ts.map