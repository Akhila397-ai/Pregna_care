var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "inversify";
import { Types } from "mongoose";
import otpModel from "../../../models/otp.model.js";
import { BaseRepository } from "../../base/base.repository.js";
let OtpRepository = class OtpRepository extends BaseRepository {
    constructor() {
        super(otpModel);
    }
    async createOtp(data) {
        return await this.create(data);
    }
    async findActiveOtp(userId, purpose) {
        return await otpModel
            .findOne({ userId, purpose, isUsed: false })
            .sort({ createdAt: -1 })
            .lean();
    }
    async incrementOTPAttempts(otpId) {
        const objectId = Types.ObjectId.isValid(otpId) ? new Types.ObjectId(otpId) : otpId;
        return await otpModel
            .findByIdAndUpdate(objectId, { $inc: { attempts: 1 } }, { new: true })
            .lean();
    }
    async markOtpAsUsed(otpId) {
        const objectId = Types.ObjectId.isValid(otpId) ? new Types.ObjectId(otpId) : otpId;
        await otpModel.findByIdAndUpdate(objectId, { $set: { isUsed: true } });
    }
    async invalidateAllOTPs(userId, purpose) {
        await otpModel.updateMany({ userId, purpose, isUsed: false }, { $set: { isUsed: true } });
    }
};
OtpRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], OtpRepository);
export { OtpRepository };
//# sourceMappingURL=otp.repository.js.map