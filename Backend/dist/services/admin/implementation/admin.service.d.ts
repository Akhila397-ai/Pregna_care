import "reflect-metadata";
import type { IAdminService } from "../interface/IAdmin.service.js";
import type { IAdminRepository } from "../../../repositories/admin/interface/IAdmin.repository.js";
import { MessageResponseDTO } from "../../../dtos/auth.dto.js";
import { GetMappedDoctorsResponse, GetMappedUsersResponse } from "../../../dtos/admin.dto.js";
import { VerifyDoctorDTO } from "../../../dtos/admin.dto.js";
import { DocumentType } from "../interface/IAdmin.service.js";
import { DocumentPresignedUrlDTO } from "../../../dtos/admin.dto.js";
export declare class AdminService implements IAdminService {
    private adminRepository;
    constructor(adminRepository: IAdminRepository);
    getAllUsers(page: number, limit: number): Promise<GetMappedUsersResponse>;
    blockUser(userId: string): Promise<MessageResponseDTO>;
    unblockUser(userId: string): Promise<MessageResponseDTO>;
    deleteUser(userId: string): Promise<MessageResponseDTO>;
    getAllDoctors(page: number, limit: number): Promise<GetMappedDoctorsResponse>;
    verifyDoctor(doctorId: string, adminId: string, dto: VerifyDoctorDTO): Promise<MessageResponseDTO>;
    approveDoctor(doctorId: string, adminId: string): Promise<MessageResponseDTO>;
    rejectDoctor(doctorId: string, _adminId: string, rejectionReason?: string): Promise<MessageResponseDTO>;
    blockDoctor(doctorId: string): Promise<MessageResponseDTO>;
    unblockDoctor(doctorId: string): Promise<MessageResponseDTO>;
    deleteDoctor(doctorId: string): Promise<MessageResponseDTO>;
    getDoctorDocumentUrl(doctorId: string, documentType: DocumentType): Promise<DocumentPresignedUrlDTO>;
}
//# sourceMappingURL=admin.service.d.ts.map