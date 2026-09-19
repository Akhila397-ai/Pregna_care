import { IDoctorRepository } from "../interface/IDoctor.repository.js";
import { doctorApplicationData, DoctorApplicationDocument, DoctorApplicationWithUser } from "../../../types/doctor.js";
import { BaseRepository } from "../../base/base.repository.js";
export declare class DoctorRepository extends BaseRepository<doctorApplicationData> implements IDoctorRepository {
    constructor();
    createApplication(data: doctorApplicationData): Promise<DoctorApplicationDocument>;
    findApplicationByUserId(userId: string): Promise<DoctorApplicationWithUser | null>;
    findApplicationById(id: string): Promise<DoctorApplicationDocument | null>;
    updateApplicationStatus(id: string, status: "approved" | "rejected" | "pending", adminId?: string, rejectionReason?: string): Promise<void>;
    updateApplication(id: string, data: Partial<doctorApplicationData>): Promise<void>;
}
//# sourceMappingURL=doctor.repository.d.ts.map