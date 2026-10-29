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
import doctorApplicationModel from "../../../models/doctorApplication.model.js";
import UserModel from "../../../models/User.model.js";
import { BaseRepository } from "../../base/base.repository.js";
let DoctorRepository = class DoctorRepository extends BaseRepository {
    constructor() {
        super(doctorApplicationModel);
    }
    async createApplication(data) {
        const doc = await doctorApplicationModel.create(data);
        return doc.toObject();
    }
    async findApplicationByUserId(userId) {
        const userObjectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
        const application = (await doctorApplicationModel
            .findOne({
            userId: userObjectId,
            isDeleted: false,
        })
            .sort({ createdAt: -1 })
            .lean());
        if (!application)
            return null;
        const user = await UserModel.findOne({ _id: application.userId, isDeleted: false }).lean();
        if (!user)
            return null;
        return {
            application,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                imageUrl: user.imageUrl,
                isBlocked: user.isBlocked,
                isVerified: user.isVerified,
                isDeleted: user.isDeleted,
            },
        };
    }
    async findApplicationById(id) {
        return (await doctorApplicationModel.findOne({ _id: id }).lean());
    }
    async findVerifiedDoctors() {
        const applications = (await doctorApplicationModel
            .find({
            status: "approved",
            isBlocked: false,
            isDeleted: false,
        })
            .sort({ createdAt: -1 })
            .lean());
        if (!applications.length)
            return [];
        const userIds = applications.map((app) => app.userId);
        const users = await UserModel.find({
            _id: { $in: userIds },
            role: "doctor",
            isVerified: true,
            isBlocked: false,
            isDeleted: false,
        }).lean();
        const userMap = new Map(users.map((u) => [u._id.toString(), u]));
        return applications
            .map((app) => {
            const user = userMap.get(app.userId.toString());
            if (!user)
                return null;
            return {
                application: app,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    fullName: user.fullName,
                    phone: user.phone,
                    imageUrl: user.imageUrl,
                    isBlocked: user.isBlocked,
                    isVerified: user.isVerified,
                    isDeleted: user.isDeleted,
                },
            };
        })
            .filter((item) => item !== null);
    }
    async updateApplicationStatus(id, status, adminId, rejectionReason) {
        const update = { status };
        if (status === "approved" && adminId) {
            update.approvedBy = new Types.ObjectId(adminId);
            update.approvedAt = new Date();
        }
        if (status === "rejected" && rejectionReason) {
            update.rejectionReason = rejectionReason;
        }
        const app = await doctorApplicationModel.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (status === "approved" && app) {
            await UserModel.findByIdAndUpdate(app.userId, { $set: { role: "doctor", isVerified: true } });
        }
        else if (status === "rejected" && app) {
            await UserModel.findByIdAndUpdate(app.userId, { $set: { role: "user" } });
        }
    }
    async updateApplication(id, data) {
        await doctorApplicationModel.findByIdAndUpdate(id, { $set: data });
    }
};
DoctorRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], DoctorRepository);
export { DoctorRepository };
//# sourceMappingURL=doctor.repository.js.map