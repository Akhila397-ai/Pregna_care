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
import UserModel from "../../../models/User.model.js";
import doctorApplicationModel from "../../../models/doctorApplication.model.js";
import { BaseRepository } from "../../base/base.repository.js";
let AdminRepository = class AdminRepository extends BaseRepository {
    constructor() {
        super(UserModel);
    }
    async findAdminByEmail(email) {
        return await this.findOne({
            email,
            role: "admin",
            isDeleted: false,
        });
    }
    // User Management
    async findAllUsers(page, limit) {
        const skip = (page - 1) * limit;
        const query = { role: "user", isDeleted: false };
        const total = await this.count(query);
        const users = await this.findMany(query, skip, limit, { createdAt: -1 });
        return { users, total };
    }
    async findUserById(id) {
        return await this.findOne({
            _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id,
            role: "user",
            isDeleted: false,
        });
    }
    async blockUser(id) {
        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        await UserModel.findByIdAndUpdate(objectId, { $set: { isBlocked: true } });
    }
    async unblockUser(id) {
        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        await UserModel.findByIdAndUpdate(objectId, { $set: { isBlocked: false } });
    }
    async softDeleteUser(id) {
        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        await UserModel.findByIdAndUpdate(objectId, { $set: { isDeleted: true } });
    }
    // Doctor Management
    async findAllDoctors(page, limit) {
        const skip = (page - 1) * limit;
        const total = await doctorApplicationModel.countDocuments({ isDeleted: false });
        const applications = (await doctorApplicationModel
            .find({ isDeleted: false })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean());
        const userIds = applications.map((app) => app.userId);
        const users = await UserModel.find({ _id: { $in: userIds } }).lean();
        const userMap = new Map(users.map((u) => [u._id.toString(), u]));
        const items = applications
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
        return {
            doctors: items,
            total,
        };
    }
    async verifyDoctor(id, status, adminId, remarks) {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = await doctorApplicationModel
            .findOneAndUpdate({ $or: [{ _id: docObjectId }, { userId: docObjectId }] }, {
            $set: {
                status,
                verifiedBy: new Types.ObjectId(adminId),
                verifiedAt: new Date(),
                verificationRemarks: remarks ?? "",
            },
        }, { new: true })
            .lean();
        if (status === "approved" && app) {
            await UserModel.findByIdAndUpdate(app.userId, { $set: { role: "doctor", isVerified: true } });
        }
    }
    async findDoctorById(id) {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = (await doctorApplicationModel
            .findOne({ $or: [{ _id: docObjectId }, { userId: docObjectId }], isDeleted: false })
            .lean());
        if (!app)
            return null;
        const user = await UserModel.findById(app.userId).lean();
        if (!user)
            return null;
        return {
            application: app,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName,
                imageUrl: user.imageUrl,
                isBlocked: user.isBlocked,
                isVerified: user.isVerified,
                isDeleted: user.isDeleted,
            },
        };
    }
    async approveDoctor(id, adminId) {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = await doctorApplicationModel
            .findOneAndUpdate({ $or: [{ _id: docObjectId }, { userId: docObjectId }] }, {
            $set: {
                status: "approved",
                approvedBy: new Types.ObjectId(adminId),
                approvedAt: new Date(),
            },
        }, { new: true })
            .lean();
        if (app) {
            await UserModel.findByIdAndUpdate(app.userId, { $set: { role: "doctor", isVerified: true } });
        }
    }
    async rejectDoctor(id, rejectionReason) {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        await doctorApplicationModel.findOneAndUpdate({ $or: [{ _id: docObjectId }, { userId: docObjectId }] }, {
            $set: {
                status: "rejected",
                rejectionReason,
            },
        });
    }
    async blockDoctor(id) {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = await doctorApplicationModel
            .findOneAndUpdate({ $or: [{ _id: docObjectId }, { userId: docObjectId }] }, { $set: { isBlocked: true } }, { new: true })
            .lean();
        if (app) {
            await UserModel.findByIdAndUpdate(app.userId, { $set: { isBlocked: true } });
        }
    }
    async unblockDoctor(id) {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = await doctorApplicationModel
            .findOneAndUpdate({ $or: [{ _id: docObjectId }, { userId: docObjectId }] }, { $set: { isBlocked: false } }, { new: true })
            .lean();
        if (app) {
            await UserModel.findByIdAndUpdate(app.userId, { $set: { isBlocked: false } });
        }
    }
    async softDeleteDoctor(id) {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = await doctorApplicationModel
            .findOneAndUpdate({ $or: [{ _id: docObjectId }, { userId: docObjectId }] }, { $set: { isDeleted: true } }, { new: true })
            .lean();
        if (app) {
            await UserModel.findByIdAndUpdate(app.userId, { $set: { isDeleted: true } });
        }
    }
};
AdminRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], AdminRepository);
export { AdminRepository };
//# sourceMappingURL=admin.repository.js.map