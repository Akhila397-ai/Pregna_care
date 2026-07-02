import { Types } from "mongoose";
import { doctorApplicationData } from "../types/doctor.js";
import { DoctorApplicationDTO,DoctorDashboardDTO,DoctorStatusResponseDTO } from "../dtos/doctor.dto.js";
import { DoctorApplicationWithUser } from "../types/doctor.js";

export const toDoctorApplicationDTO = (
    app: doctorApplicationData & { _id: Types.ObjectId}
): DoctorApplicationDTO => ({
    id: app._id.toString(),
    userId: app.userId.toString(),
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
    approvedBy: app.approvedBy?.toString(),
    approvedAt: app.approvedAt,
    createdAt: app.createdAt,
})

export const toDoctorDashboardDTO = (
  { application, user }: DoctorApplicationWithUser
): DoctorDashboardDTO => ({
  application: toDoctorApplicationDTO(application),
  name:        user.name,
  email:       user.email,
  phone:       user.phone,
  imageUrl:    user.imageUrl,
});

export const toDoctorStatusDTO = (
  { application, user }: DoctorApplicationWithUser
): DoctorStatusResponseDTO => ({
  status:          application.status,
  application:     toDoctorApplicationDTO(application),
  rejectionReason: application.rejectionReason,
});

