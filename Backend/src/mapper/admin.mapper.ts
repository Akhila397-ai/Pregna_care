import { Types } from "mongoose";
import { userData } from "../types/user.js";
import { IUserMappedData,IDoctorsMappedData,AdminAuthDTO} from "../dtos/admin.dto.js";
import { doctorApplicationData, DoctorApplicationDocument,DoctorApplicationWithUser } from "../types/doctor.js";



type PresignedUrls = {
    profileImage ?: string;
    degreeCertificateUrl?:  string;
    registrationCertificateUrl?: string;
    governmentIdUrl?: string;
}

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
  { application, user }: DoctorApplicationWithUser,
  presignedUrls: PresignedUrls
   = {}
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

  // ← from DoctorApplication
  fullName:           application.fullName,
  specialization:     application.specialization,
  qualification:      application.qualification,
  experience:         application.experience,
  registrationNumber: application.registrationNumber,
  consultationFee:    application.consultationFee,
  clinicName:         application.clinicName,
  clinicAddress:      application.clinicAddress,
  availability:       application.availability,
  status:             application.status,
  verificationRemarks: application.verificationRemarks,
  verifiedBy:         application.verifiedBy?.toString(),
  verifiedAt:         application.verifiedAt,
  createdAt:          application.createdAt,

  // ← presigned URLs
  profileImage:               presignedUrls.profileImage,
  degreeCertificateUrl:       presignedUrls.degreeCertificateUrl,
  registrationCertificateUrl: presignedUrls.registrationCertificateUrl,
  governmentIdUrl:            presignedUrls.governmentIdUrl,
})