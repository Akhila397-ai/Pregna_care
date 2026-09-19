import { DoctorApplyDTO, DoctorApplyResponseDTO } from "../../../dtos/doctor.dto.js";
import { DoctorStatusResponseDTO, DoctorDashboardDTO } from "../../../dtos/doctor.dto.js";
import { UploadFiles } from "../implementation/doctor.service.js";
export interface IDoctorService {
    apply(userId: string, data: DoctorApplyDTO, files: UploadFiles): Promise<DoctorApplyResponseDTO>;
    getMyStatus(userId: string): Promise<DoctorStatusResponseDTO>;
    getMyDashboard(userId: string): Promise<DoctorDashboardDTO>;
}
//# sourceMappingURL=IDoctor.service.d.ts.map