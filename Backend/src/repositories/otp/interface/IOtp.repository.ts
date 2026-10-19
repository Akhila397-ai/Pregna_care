import { Types } from "mongoose";
import { otpData, OTPPurpose } from "../../../types/otp.js";
import { IBaseRepository } from "../../base/IBase.repository.js";

export interface IOtpRepository extends IBaseRepository<otpData> {
  createOtp(data: Partial<otpData>): Promise<otpData & { _id: Types.ObjectId }>;
  findActiveOtp(userId: string, purpose: OTPPurpose): Promise<(otpData & { _id: Types.ObjectId }) | null>;
  incrementOTPAttempts(otpId: string): Promise<(otpData & { _id: Types.ObjectId }) | null>;
  markOtpAsUsed(otpId: string): Promise<void>;
  invalidateAllOTPs(userId: string, purpose: OTPPurpose): Promise<void>;
}
