import { injectable } from "inversify";
import { Types } from "mongoose";
import { IOtpRepository } from "../interface/IOtp.repository.js";
import { otpData, OTPPurpose } from "../../../types/otp.js";
import otpModel from "../../../models/otp.model.js";
import { BaseRepository } from "../../base/base.repository.js";
import { OTP_EXPIRY_MS } from "../../../constants/otp.constant.js";

@injectable()
export class OtpRepository extends BaseRepository<otpData> implements IOtpRepository {
  constructor() {
    super(otpModel);
  }

  async createOtp(data: Partial<otpData>): Promise<otpData & { _id: Types.ObjectId }> {
    return await this.create(data);
  }

  async findActiveOtp(userId: string, purpose: OTPPurpose): Promise<(otpData & { _id: Types.ObjectId }) | null> {
    const validAfter = new Date(Date.now() - OTP_EXPIRY_MS)
    return await otpModel
      .findOne({ userId, purpose, isUsed: false, createdAt: { $gt: validAfter} })
      .sort({ createdAt: -1 })
      .lean();
  }

  async incrementOTPAttempts(otpId: string): Promise<(otpData & { _id: Types.ObjectId }) | null> {
    const objectId = Types.ObjectId.isValid(otpId) ? new Types.ObjectId(otpId) : otpId;
    return await otpModel
      .findByIdAndUpdate(
        objectId,
        { $inc: { attempts: 1 } },
        { new: true }
      )
      .lean();
  }

  async markOtpAsUsed(otpId: string): Promise<void> {
    const objectId = Types.ObjectId.isValid(otpId) ? new Types.ObjectId(otpId) : otpId;
    await otpModel.findByIdAndUpdate(objectId, { $set: { isUsed: true } });
  }

  async invalidateAllOTPs(userId: string, purpose: OTPPurpose): Promise<void> {
    await otpModel.updateMany(
      { userId, purpose, isUsed: false },
      { $set: { isUsed: true } }
    );
  }
}
