import { injectable } from "inversify";
import { Types } from "mongoose";
import { IAdminRepository } from "../interface/IAdmin.repository.js";
import UserModel from "../../../models/User.model.js";
import { userData } from "../../../types/user.js";
import doctorApplicationModel from "../../../models/doctorApplication.model.js";
import { doctorApplicationData, DoctorApplicationDocument } from "../../../types/doctor.js";



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

    async findAllDoctors(page: number, limit: number): Promise<{ doctors: DoctorApplicationDocument[]; total: number; }> {
        const skip = (page -1) * limit;
        const total = await doctorApplicationModel
        .countDocuments({ isDeleted: false})
        const doctors = await doctorApplicationModel
        .find({ isDeleted: false})
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1})
        .lean() as DoctorApplicationDocument[];

        return { doctors, total}
    }
    async findDoctorById(id: string): Promise<DoctorApplicationDocument | null> {
        return await doctorApplicationModel
        .findOne({ _id: id, isDeleted: false})
        .lean()  as DoctorApplicationDocument | null;
    }
    async approveDoctor(id: string, adminId: string): Promise<void> {
        await doctorApplicationModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    status:  'approved',
                    isVerified: true,
                    approvedBy: new Types.ObjectId(adminId),
                    approvedAt: new Date()
                },
            }
        );
    }

    async rejectDoctor(id: string, rejectionReason: string): Promise<void> {
        await doctorApplicationModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    status:   'rejected',
                    rejectionReason: rejectionReason
                }
            }
        )
    }

    async blockDoctor(id: string): Promise<void> {
        await doctorApplicationModel.findByIdAndUpdate(
            id,
            {$set: {isBlocked: true}}
        );
        const app = await doctorApplicationModel
        .findById(id)
        .select('userId')
        .lean()

        if(app) {
            await UserModel.findByIdAndUpdate(
                app.userId,
                {$set: { isBlocked: true}}
            )
        }
    }

    async unblockDoctor(id: string): Promise<void> {
        await doctorApplicationModel.findByIdAndUpdate(
           id,
           { $set: { isBlocked: false}}
        )

        const app = await doctorApplicationModel
        .findById(id)
        .select('userId')
        .lean()

        if(app) {
            await UserModel.findByIdAndUpdate(
                app.userId,
                { $set: {isBlocked: false}}
            )
        }
    }

    async softDeleteDoctor(id: string): Promise<void> {
        await doctorApplicationModel.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true}}
        );

         const app = await doctorApplicationModel
      .findById(id)
      .select('userId')
      .lean();

    if (app) {
      await UserModel.findByIdAndUpdate(
        app.userId,
        { $set: { isDeleted: true } }
      );
    }
    }


   
}