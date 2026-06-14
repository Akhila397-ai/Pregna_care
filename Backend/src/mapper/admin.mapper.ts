import { Types } from "mongoose";
import { userData } from "../types/user.js";
import { IUserMappedData,IDoctorsMappedData,AdminAuthDTO} from "../dtos/admin.dto.js";

export const toAdminAuthDTO = (
    user: userData & {_id: Types.ObjectId}
): AdminAuthDTO => ({
    id:  user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: !!user.isBlocked,
    isVerified: !!user.isVerified,
})

export const toUserMappedData = (
    user: userData & {_id: Types.ObjectId; createdAt?: Date}
): IUserMappedData => ({
    _id: user._id.toString(),
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
    isDeleted: user.isDeleted,
    isVerified: user.isVerified,
    imageUrl: user.imageUrl,
    mobileNumber: user.phone,
    createdAt: user.createdAt,
})

export const toDoctorMappedData = (
    user: userData & {
        _id: Types.ObjectId;
        isApproved?: boolean;
        specialization?: string;
        createdAt?: Date
    }
): IDoctorsMappedData => ({
    _id: user._id.toString(),
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
    isVerified: user.isVerified,
    isDeleted: user.isDeleted,
    isApproved: user.isApproved ?? false,
    imageUrl: user.imageUrl,
    mobileNumber: user.phone,
    specialization: user.specialization,
    createdAt: user.createdAt,
})
