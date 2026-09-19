import { Types } from "mongoose";
import { IUserRepository } from "../interface/IUser.repository.js";
import { onboardingType, userData } from "../../../types/user.js";
import { BaseRepository } from "../../base/base.repository.js";
export declare class UserRepository extends BaseRepository<userData> implements IUserRepository {
    constructor();
    findByEmail(email: string): Promise<(userData & {
        _id: Types.ObjectId;
    }) | null>;
    updatePassword(id: string, hash: string): Promise<void>;
    markVerified(id: string): Promise<void>;
    updateRole(id: string, role: string): Promise<void>;
    setOnboarding(id: string, onboardingType: onboardingType): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map