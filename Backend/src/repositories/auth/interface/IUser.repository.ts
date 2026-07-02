import { IBaseRepository } from "../../base.repository.js";
import { onboardingType, userData } from "../../../types/user.js";
import { otpData, OTPPurpose } from "../../../types/otp.js";
import { Types } from "mongoose";

export interface IUserRepository extends IBaseRepository<userData>{

    //userside
    findByEmail(email: string): Promise<(userData & {_id: Types.ObjectId} ) | null>;
    updatePassword(id: string, hash: string): Promise<void>;
    markVerified(id: string): Promise<void>
    updateRole(id: string, role: string):     Promise<void>;
    setOnboarding(id: string, onboardingType: onboardingType): Promise<void>;
    //otpside of user
    createOtp(date: Partial<otpData>): Promise<otpData & {_id: Types.ObjectId}>;
    findActiveOtp(userId: string,purpose: OTPPurpose): Promise<(otpData & {_id: Types.ObjectId}) | null> 
    incrementOTPAttempts(otpId: string): Promise<(otpData & {_id: Types.ObjectId}) | null>
    markOtpAsused(otpId: string): Promise<void>;
    invalidateAllOTPs(userId: string, purpose: OTPPurpose):Promise<void>;
}  