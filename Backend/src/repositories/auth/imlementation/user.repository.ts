import { injectable }          from 'inversify';
import { IUserRepository } from '../interface/IUser.repository.js';
import { userData } from '../../../types/user.js';
import { otpData,OTPPurpose } from '../../../types/otp.js';
import userModel from '../../../models/User.model.js';
import otpModel from '../../../models/otp.model.js';
import { Types } from 'mongoose';

@injectable()
export class UserRepository implements IUserRepository {
   async findById(id: string): Promise<(userData & { _id: Types.ObjectId }) | null> {
  return await userModel.findById(id).lean();
}

   async create(data: Partial<userData>): Promise<userData & { _id: Types.ObjectId; }> {
       return await userModel.create(data)
   }
    async update(id: string, data: Partial<userData>): Promise<(userData & { _id: Types.ObjectId; }) | null> {
        return await userModel.findByIdAndUpdate(
            id,
            { $set: data},
            {new: true}
        ).lean()
    }
    async delete(id: string): Promise<void> {
        await userModel.findByIdAndUpdate(id)
    }

    //user specific

    async findByEmail(email: string): Promise<(userData & { _id: Types.ObjectId; }) | null> {
        return await userModel.findOne({email}).lean()
    }

    async updatePassword(id: string, hash: string): Promise<void> {
        await userModel.findByIdAndUpdate(id,{$set:{password:hash}});
    }

    async markVerified(id: string): Promise<void> {
        await userModel.findByIdAndUpdate(id, {$set: {isVerified: true}})
    }

    //otp

    async createOtp(date: Partial<otpData>): Promise<otpData & { _id: Types.ObjectId; }> {
        return await otpModel.create(date)
    }

    async findActiveOtp(userId: string, purpose: OTPPurpose): Promise<(otpData & { _id: Types.ObjectId; }) | null> {
        return await otpModel.findOne({userId, purpose, isUsed: false}).sort({ createdAt: -1}).lean()
    }

    async incrementOTPAttempts(otpId: string): Promise<(otpData & { _id: Types.ObjectId; }) | null> {
        return await otpModel.findByIdAndUpdate(
            otpId,
            { $inc: { attempts: 1}},
            {new: true}
        ).lean()
    }
    async markOtpAsused(otpId: string): Promise<void> {
         otpModel.findByIdAndUpdate(otpId,{ $set: { isUsed: true}})
    }

    async invalidateAllOTPs(userId: string, purpose: OTPPurpose): Promise<void> {
        await otpModel.updateMany(
            {userId,purpose,
                isUsed: false
            },
            { $set: {isUsed: true}}
        )
    }





    
}