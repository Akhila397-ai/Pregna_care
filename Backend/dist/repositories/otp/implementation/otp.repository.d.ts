import { Types } from "mongoose";
import { IOtpRepository } from "../interface/IOtp.repository.js";
import { otpData, OTPPurpose } from "../../../types/otp.js";
import { BaseRepository } from "../../base/base.repository.js";
export declare class OtpRepository extends BaseRepository<otpData> implements IOtpRepository {
    constructor();
    createOtp(data: Partial<otpData>): Promise<otpData & {
        _id: Types.ObjectId;
    }>;
    findActiveOtp(userId: string, purpose: OTPPurpose): Promise<(otpData & {
        _id: Types.ObjectId;
    }) | null>;
    incrementOTPAttempts(otpId: string): Promise<(otpData & {
        _id: Types.ObjectId;
    }) | null>;
    markOtpAsUsed(otpId: string): Promise<void>;
    invalidateAllOTPs(userId: string, purpose: OTPPurpose): Promise<void>;
}
//# sourceMappingURL=otp.repository.d.ts.map