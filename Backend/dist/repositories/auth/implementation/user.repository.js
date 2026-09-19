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
import userModel from "../../../models/User.model.js";
import { BaseRepository } from "../../base/base.repository.js";
let UserRepository = class UserRepository extends BaseRepository {
    constructor() {
        super(userModel);
    }
    async findByEmail(email) {
        return await this.findOne({ email });
    }
    async updatePassword(id, hash) {
        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        await this.model.findByIdAndUpdate(objectId, { $set: { password: hash } });
    }
    async markVerified(id) {
        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        await this.model.findByIdAndUpdate(objectId, { $set: { isVerified: true } });
    }
    async updateRole(id, role) {
        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        await this.model.findByIdAndUpdate(objectId, { $set: { role } });
    }
    async setOnboarding(id, onboardingType) {
        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        await this.model.findByIdAndUpdate(objectId, {
            $set: {
                onboardingType,
                isOnboarded: true,
            },
        });
    }
};
UserRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], UserRepository);
export { UserRepository };
//# sourceMappingURL=user.repository.js.map