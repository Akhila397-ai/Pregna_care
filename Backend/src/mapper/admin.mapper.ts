import { Types } from "mongoose";
import { userData } from "../types/user.js";
import { IUserMappedData,IDoctorsMappedData,AdminAuthDTO} from "../dtos/admin.dto.js";
import { doctorApplicationData, DoctorApplicationDocument } from "../types/doctor.js";



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

export const toDoctorMappedData = (
    app:  DoctorApplicationDocument
): IDoctorsMappedData => ({
    _id:  app._id.toString(),
    userId: app.userId.toString(),
    fullName: app.fullName,
    email: app.email,
    phone: app.phone,
    specialization: app.specialization,
    qualification: app.qualification,
    experience: app.experience,
    registrationNumber: app.registrationNumber,
    consultationFee: app.consultationFee,
    clinicName: app.clinicName,
    clinicAddress: app.clinicAddress,
    imageUrl: app.profileImage,
    documents: app.documents,
    availability: app.availability,
    status: app.status,
    rejectionReason: app.rejectionReason,
    approvedBy: app.approvedBy?.toString(),
    approvedAt: app.approvedAt,
    createdAt:app.createdAt,
    isBlocked: app.isBlocked,
    isDeleted: app.isDeleted,
    isVerified: app.isVerified,
})