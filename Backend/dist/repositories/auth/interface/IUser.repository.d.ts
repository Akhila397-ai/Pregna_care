import { IBaseRepository } from "../../base/IBase.repository.js";
import { onboardingType, userData } from "../../../types/user.js";
import { Types } from "mongoose";
export interface IUserRepository extends IBaseRepository<userData> {
    findByEmail(email: string): Promise<(userData & {
        _id: Types.ObjectId;
    }) | null>;
    updatePassword(id: string, hash: string): Promise<void>;
    markVerified(id: string): Promise<void>;
    updateRole(id: string, role: string): Promise<void>;
    setOnboarding(id: string, onboardingType: onboardingType): Promise<void>;
}
//# sourceMappingURL=IUser.repository.d.ts.map