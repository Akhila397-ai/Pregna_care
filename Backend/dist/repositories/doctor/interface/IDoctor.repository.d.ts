import { doctorApplicationData, DoctorApplicationWithUser, DoctorApplicationDocument } from "../../../types/doctor.js";
import { IBaseRepository } from "../../base/IBase.repository.js";
export interface IDoctorRepository extends IBaseRepository<doctorApplicationData> {
    createApplication(data: doctorApplicationData): Promise<DoctorApplicationDocument>;
    findApplicationByUserId(userId: string): Promise<DoctorApplicationWithUser | null>;
    findApplicationById(id: string): Promise<DoctorApplicationDocument | null>;
    updateApplicationStatus(id: string, status: "approved" | "rejected" | "pending", adminId?: string, rejectionReason?: string): Promise<void>;
    updateApplication(id: string, data: Partial<doctorApplicationData>): Promise<void>;
}
//# sourceMappingURL=IDoctor.repository.d.ts.map