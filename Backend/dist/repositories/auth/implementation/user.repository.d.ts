import { Types } from "mongoose";
import { IUserRepository } from "../interface/IUser.repository.js";
import { EmergencyContactRelationship, onboardingType, userData } from "../../../types/user.js";
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
    setPregnancyLMP(id: string, lmpDate: Date): Promise<void>;
    setCycleInfo(id: string, periodStartDate: Date, cycleLength?: number, periodLength?: number): Promise<void>;
    addEmergencyContact(userId: string, contact: {
        name: string;
        phoneNumber: string;
        relationship: EmergencyContactRelationship;
    }): Promise<(userData & {
        _id: Types.ObjectId;
    }) | null>;
    updateEmergencyContact(userId: string, contactId: string, contact: {
        name: string;
        phoneNumber: string;
        relationship: EmergencyContactRelationship;
    }): Promise<(userData & {
        _id: Types.ObjectId;
    }) | null>;
    deleteEmergencyContact(userId: string, contactId: string): Promise<(userData & {
        _id: Types.ObjectId;
    }) | null>;
}
//# sourceMappingURL=user.repository.d.ts.map