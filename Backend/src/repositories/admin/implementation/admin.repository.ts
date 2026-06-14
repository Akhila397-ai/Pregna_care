import { injectable } from "inversify";
import { Types } from "mongoose";
import { IAdminRepository } from "../interface/IAdmin.repository.js";
import UserModel from "../../../models/User.model.js";
import { userData } from "../../../types/user.js";


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

    async findAllDoctors(page: number, limit: number): Promise<{ doctors: (userData & { _id: Types.ObjectId; isApproved?: boolean; specialization?: string; createdAt?: Date; })[]; total: number; }> {
        const skip = (page-1) * limit;
        const query = {role: 'doctor', isDeleted: false};
        const total = await UserModel.countDocuments(query);
        const doctors = await UserModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({createdAt: -1})
        .lean();

        return { doctors, total}
    }

    async findDoctorById(id: string): Promise<(userData & { _id: Types.ObjectId; }) | null> {
        return await UserModel.findOne({
            _id: id,
            role: 'doctor',
            isDeleted: false,
        }).lean()
    }

    async approveDoctor(id: string): Promise<void> {
        await UserModel.findByIdAndUpdate(
            {_id: id},
            {$set: {isApproved: true}}
        );
    }

    async rejectDoctor(id: string): Promise<void> {
        await UserModel.findByIdAndUpdate(
            {_id: id},
            {$set: {isApproved: false}}
        );
    }

    async blockDoctor(id: string): Promise<void> {
        await UserModel.findByIdAndUpdate(
            {_id: id},
            {$set: {isBlocked: false}}
        );
    }

    async unblockDoctor(id: string): Promise<void> {
        await UserModel.findByIdAndUpdate(
            {_id: id},
            {$set: {isBlocked: false}}
        )
    }

   
}