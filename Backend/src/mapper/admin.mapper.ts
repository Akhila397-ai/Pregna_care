import { Types } from "mongoose";
import { userData } from "../types/user.js";
import { IUserMappedData,IDoctorsMappedData,AdminAuthDTO} from "../dtos/admin.dto.js";
import { doctorApplicationData, DoctorApplicationDocument } from "../types/doctor.js";
import type {DoctorApplicationWithUser}  from "../types/doctor.js";


type PopulatedDoctorApplication = doctorApplicationData & {
    _id: Types.ObjectId;
    createdAt?: Date,
    userId: userData & {
        _id: Types.ObjectId;
    },
    specialization?: string;
}
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


export const toDoctorsMappedData = (
  { application, user }: DoctorApplicationWithUser
): IDoctorsMappedData => ({
    _id:    application._id.toString(),
    userId: application.userId.toString(),
    name:       user.name,
    email:      user.email,
    phone:      user.phone,
    imageUrl:   user.imageUrl,
    isBlocked:  user.isBlocked,
    isDeleted:  user.isDeleted,
    isVerified: user.isVerified,
    specialization:     application.specialization,
    qualification:      application.qualification,
    experience:         application.experience,
    registrationNumber: application.registrationNumber,
    consultationFee:    application.consultationFee,
    clinicName:         application.clinicName,
    clinicAddress:      application.clinicAddress,
    profileImage:       application.profileImage,
    documents:          application.documents,
    availability:       application.availability,
    status:             application.status,
    rejectionReason:    application.rejectionReason,
    approvedBy:         application.approvedBy?.toString(),
    approvedAt:         application.approvedAt,
    createdAt:          application.createdAt,
})