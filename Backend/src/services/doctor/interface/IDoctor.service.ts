import { DoctorApplyDTO,DoctorApplyResponseDTO,DoctorApplicationDTO,DoctorProfileDTO} from "../../../dtos/doctor.dto.js";
import { DoctorStatus } from "../../../types/doctor.js";
import { DoctorStatusResponseDTO } from "../../../dtos/doctor.dto.js";


export interface IDoctorService {
    apply(data: DoctorApplyDTO):    Promise<DoctorApplyResponseDTO>;
    getMyApplication(userId: string):  Promise<DoctorApplicationDTO | null>;
    getMyProfile(userId: string):    Promise<DoctorProfileDTO | null>;
    getMyStatus(userId: string):     Promise<DoctorStatusResponseDTO>;
}