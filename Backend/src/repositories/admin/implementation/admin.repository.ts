import { injectable } from "inversify";
import { Types } from "mongoose";
import { IAdminRepository } from "../interface/IAdmin.repository.js";
import UserModel from "../../../models/User.model.js";
import { userData } from "../../../types/user.js";
import doctorApplicationModel from "../../../models/doctorApplication.model.js";
import { doctorApplicationData, DoctorApplicationDocument, DoctorApplicationWithUser, DoctorStatus } from "../../../types/doctor.js";
import { stat } from "node:fs";



@injectable()
export class AdminRepository implements IAdminRepository {

    async findById(id: string): Promise<(userData & { _id: Types.ObjectId; }) | null> {
        return await UserModel.findById(id).lean()
    }

    async create(data: Partial<userData>): Promise<userData & { _id: Types.ObjectId; }> {
        return await UserModel.create(data)
    }

    async update(id: string, data: Partial<userData>): Promise<(userData & { _id: Types.ObjectId; }) | null> {
        return await UserModel.findByIdAndUpdate(
            id,
            {$set: data},
            {new: true}
        ).lean();
    }

    async delete(id: string): Promise<void> {
         UserModel.findByIdAndUpdate(id)
    }

    //admin

    async findAdminByEmail(email: string): Promise<(userData & { _id: Types.ObjectId; }) | null> {
        return await UserModel.findOne({
            email,
            role: 'admin',
            isDeleted: false,
        }).lean();
    }

    //userManagemnt

    async findAllUsers(page: number, limit: number): Promise<{ users: (userData & { _id: Types.ObjectId; createdAt?: Date; })[]; total: number; }> {
        const skip = (page-1) * limit;
        const query = {role: 'user', isDeleted: false};
        const total = await UserModel.countDocuments(query);
        const users = await UserModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({createdAt: -1})
        .lean();

        return { users, total}
    }

    async findUserById(id: string): Promise<(userData & { _id: Types.ObjectId; }) | null> {
        return await UserModel.findOne({
            _id: id,
            role: 'user',
            isDeleted: false,
        }).lean()
    }

    async blockUser(id: string): Promise<void> {
        await UserModel.findByIdAndUpdate(
            id,
            {$set : {isBlocked: true}}
        );
    }

    async unblockUser(id: string): Promise<void> {
        await UserModel.findOneAndUpdate(
            {_id: id},
            {$set:{isBlocked: false}}
        );
    }

    async softDeleteUser(id: string): Promise<void> {
        await UserModel.findByIdAndUpdate(
            {_id: id},
            {$set: {isDeleted: true}}
        );
    }


    //doctor managmnt

    async findAllDoctors(page: number, limit: number): Promise<{ doctors: DoctorApplicationWithUser[]; total: number; }> {
        const skip = (page -1) * limit;
        const total = await doctorApplicationModel
        .countDocuments({ isDeleted: false})
        const applications = await doctorApplicationModel
        .find({ isDeleted: false})
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1})
        .lean() as DoctorApplicationDocument[];

        const userIds = applications.map((app)=> {
          return app.userId
        })

        const users = await UserModel
        .find({_id: {$in: userIds}})
        .lean()

        const userMap = new Map(
         users.map((u) => [u._id.toString(), u])
        );
         

       const item = applications
       .map((app): DoctorApplicationWithUser | null => {
        const user = userMap.get(app.userId.toString());

        if(!user){
            return null
        }

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
       .filter(
        (item): item is DoctorApplicationWithUser => item !== null
       );
        return {
            doctors: item,
            total
        }
    }

    async verifyDoctor(id: string, status: DoctorStatus, adminId: string, remarks?: string): Promise<void> {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = await doctorApplicationModel.findOneAndUpdate(
            { $or: [{ _id: docObjectId }, { userId: docObjectId }] },
            {
                $set: {
                    status,
                    verifiedBy:  new Types.ObjectId(adminId),
                    verifiedAt: new Date(),
                    verificationRemarks: remarks ?? '',
                }
            },
            { new: true }
        ).lean();

        if (status === 'approved' && app) {
            await UserModel.findByIdAndUpdate(
                app.userId,
                { $set: { role: 'doctor', isVerified: true } }
            );
        }
    }

    async findDoctorById(id: string): Promise<DoctorApplicationWithUser | null> {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = await doctorApplicationModel
        .findOne({ $or: [{ _id: docObjectId }, { userId: docObjectId }], isDeleted: false })
        .lean()  as DoctorApplicationDocument | null;

        if(!app) return null;

        const user = await UserModel.findById(app.userId).lean();
        if(!user) return null;

        return {
            application: app,
            user: {
                 _id:        user._id,
            name:       user.name,
            email:      user.email,
            phone:      user.phone,
            fullName: user.fullName,
            imageUrl:   user.imageUrl,
            isBlocked:  user.isBlocked,
            isVerified: user.isVerified,
            isDeleted:  user.isDeleted,
            }
        }
    }

    async approveDoctor(id: string, adminId: string): Promise<void> {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = await doctorApplicationModel.findOneAndUpdate(
            { $or: [{ _id: docObjectId }, { userId: docObjectId }] },
            {
                $set: {
                     status:     'approved',
                     approvedBy: new Types.ObjectId(adminId),
                     approvedAt: new Date(),
                },
            },
            { new: true }
        ).lean();

        if (app) {
          await UserModel.findByIdAndUpdate(
            app.userId,
            { $set: { role: 'doctor', isVerified: true } }
          );
        }
    }

    async rejectDoctor(id: string, rejectionReason: string): Promise<void> {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        await doctorApplicationModel.findOneAndUpdate(
            { $or: [{ _id: docObjectId }, { userId: docObjectId }] },
            {
                $set: {
                    status:   'rejected',
                    rejectionReason: rejectionReason
                }
            }
        );
    }

    async blockDoctor(id: string): Promise<void> {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = await doctorApplicationModel.findOneAndUpdate(
            { $or: [{ _id: docObjectId }, { userId: docObjectId }] },
            {$set: {isBlocked: true}},
            { new: true }
        ).lean();

        if (app) {
            await UserModel.findByIdAndUpdate(
                app.userId,
                {$set: { isBlocked: true}}
            );
        }
    }

    async unblockDoctor(id: string): Promise<void> {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = await doctorApplicationModel.findOneAndUpdate(
           { $or: [{ _id: docObjectId }, { userId: docObjectId }] },
           { $set: { isBlocked: false}},
           { new: true }
        ).lean();

        if (app) {
            await UserModel.findByIdAndUpdate(
                app.userId,
                { $set: {isBlocked: false}}
            );
        }
    }

    async softDeleteDoctor(id: string): Promise<void> {
        const docObjectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const app = await doctorApplicationModel.findOneAndUpdate(
            { $or: [{ _id: docObjectId }, { userId: docObjectId }] },
            { $set: { isDeleted: true}},
            { new: true }
        ).lean();

        if (app) {
          await UserModel.findByIdAndUpdate(
            app.userId,
            { $set: { isDeleted: true } }
          );
        }
    }


   
}