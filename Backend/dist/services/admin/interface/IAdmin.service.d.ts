import { GetMappedDoctorsResponse, GetMappedUsersResponse } from "../../../dtos/admin.dto.js";
import { MessageResponseDTO } from "../../../dtos/auth.dto.js";
import { VerifyDoctorDTO } from "../../../dtos/admin.dto.js";
import { DocumentPresignedUrlDTO } from "../../../dtos/admin.dto.js";
export type DocumentType = "degreeCertificate" | "registrationCertificate" | "governmentId";
export interface IAdminService {
    getAllUsers(page: number, limit: number): Promise<GetMappedUsersResponse>;
    blockUser(userId: string): Promise<MessageResponseDTO>;
    unblockUser(userId: string): Promise<MessageResponseDTO>;
    deleteUser(userId: string): Promise<MessageResponseDTO>;
    getAllDoctors(page: number, limit: number): Promise<GetMappedDoctorsResponse>;
    approveDoctor(doctorId: string, adminId: string): Promise<MessageResponseDTO>;
    verifyDoctor(doctorId: string, adminId: string, dto: VerifyDoctorDTO): Promise<MessageResponseDTO>;
    rejectDoctor(doctorId: string, adminId: string, rejectionReason?: string): Promise<MessageResponseDTO>;
    blockDoctor(doctorId: string): Promise<MessageResponseDTO>;
    unblockDoctor(doctorId: string): Promise<MessageResponseDTO>;
    deleteDoctor(doctorId: string): Promise<MessageResponseDTO>;
    getDoctorDocumentUrl(doctorId: string, documentType: DocumentType): Promise<DocumentPresignedUrlDTO>;
}
//# sourceMappingURL=IAdmin.service.d.ts.map