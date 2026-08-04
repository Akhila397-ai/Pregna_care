import { DoctorApplyDTO,DoctorApplyResponseDTO,DoctorApplicationDTO,DoctorProfileDTO} from "../../../dtos/doctor.dto.js";
import { doctorApplicationData, DoctorApplicationDocument, DoctorStatus, } from "../../../types/doctor.js";
import { DoctorStatusResponseDTO,DoctorDashboardDTO } from "../../../dtos/doctor.dto.js";
import { UploadFiles } from "../implementation/doctor.service.js";


export interface IDoctorService {
    apply(userId: string, data: DoctorApplyDTO,files: UploadFiles): Promise<DoctorApplyResponseDTO>
    getMyStatus(userId: string):     Promise<DoctorStatusResponseDTO>;
    // getMyProfile(userId: string):    Promise<DoctorProfileDTO | null>;
    getMyDashboard(userId: string):              Promise<DoctorDashboardDTO>;
}
