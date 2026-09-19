import 'reflect-metadata';
import type { IDoctorRepository } from '../../../repositories/doctor/interface/IDoctor.repository.js';
import type { IUserRepository } from '../../../repositories/auth/interface/IUser.repository.js';
import type { IDoctorService } from '../interface/IDoctor.service.js';
import { DoctorApplyDTO, DoctorDashboardDTO } from '../../../dtos/doctor.dto.js';
export interface UploadFiles {
    profileImage?: Express.Multer.File[];
    degreeCertificate?: Express.Multer.File[];
    registrationCertificate?: Express.Multer.File[];
    governmentId?: Express.Multer.File[];
}
export declare class DoctorService implements IDoctorService {
    private doctorRepository;
    private userRepository;
    constructor(doctorRepository: IDoctorRepository, userRepository: IUserRepository);
    apply(userId: string, data: DoctorApplyDTO, files: {
        [field: string]: Express.Multer.File[];
    }): Promise<{
        message: string;
        application: import("../../../dtos/doctor.dto.js").DoctorApplicationDTO;
    }>;
    getMyStatus(userId: string): Promise<import("../../../dtos/doctor.dto.js").DoctorStatusResponseDTO>;
    getMyDashboard(userId: string): Promise<DoctorDashboardDTO>;
    private _resolvePresignedUrls;
}
//# sourceMappingURL=doctor.service.d.ts.map