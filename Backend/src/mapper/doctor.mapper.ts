import { Types } from "mongoose";
import { doctorApplicationData, doctorProfileData } from "../types/doctor.js";
import { DoctorApplicationDTO,DoctorProfileDTO } from "../dtos/doctor.dto.js";


export const toDoctorApplicationDTO = (
    app: DoctorApplicationDTO & { _id: Types.ObjectId}
): DoctorApplicationDTO => ({
    id: app._id.toString(),
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
    profileImage: app.profileImage,
    documents: app.documents,
    availability: app.availability,
    status: app.status,
    rejectionReason: app.rejectionReason,
    approvedBy: app.approvedBy,
    approvedAt: app.approvedAt,
    createdAt: app.createdAt,
})


export const toDoctorProfileDTO = (
    profile: doctorProfileData & {_id: Types.ObjectId}
): DoctorProfileDTO => ({
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    applicationId: profile.applicationId.toString(),
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    specialiazation: profile.specialization,
    qualification: profile.qualification,
    experience: profile.experience,
    registrationNumber: profile.registrationNumber,
    consultationFee: profile.consultationFee,
    clinicName: profile.clinicName,
    clinicAddress: profile.clinicAddress,
    profileImage: profile.profileImage,
    documents: profile.documents,
    availability: profile.availability,
    isActive: profile.isActive,
    createdAt: profile.createdAt,

})