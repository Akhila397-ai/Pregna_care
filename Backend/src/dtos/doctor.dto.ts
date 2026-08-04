import { DoctorStatus, Availability } from "../types/doctor.js";


export interface DoctorApplyDTO {
    fullName: string;
    specialization:  string;
    qualification:   string;
    experience:      number;
    registrationNumber:  string;
    consultationFee: number;
    clinicName: string;
    clinicAddress: string;
    availability: {
        days:  string[];
        startTime: string;
        endTime:  string;
    };
}

export interface DoctorApplicationDTO {
    id:  string;
    userId: string;
    fullName: string;
    specialization: string;
    qualification: string;
    experience: number;
    registrationNumber: string;
    consultationFee: number;
    clinicName: string;
    clinicAddress: string;
    profileImage: string;
    availability: Availability;
    degreeCertificateUrl?:       string;
    registrationCertificateUrl?: string;
    governmentIdUrl?:            string;
    status:  DoctorStatus;
    verificationRemarks?: string;
    verifiedBy?:          string;
    verifiedAt?:          Date;

    createdAt?: Date;
}
export interface RejectDoctorDTO {
    rejectionReason:  string;
}

export interface DoctorDashboardDTO {
  application:        DoctorApplicationDTO;
  name:               string;    // ← from User
  email:              string;
  phone?:             string;
  imageUrl?:          string;
}
export interface DoctorProfileDTO {
    id: string;
    userId: string;
    applicationId: string;
    fullName: string;
    email: string;
    phone: string;
    specialiazation: string;
    qualification: string;
    experience: number;
    registrationNumber: string;
    consultationFee: number;
    clinicName:  string;
    clinicAddress: string;
    profileImage: string;
    documents: string[];
    availability: Availability;
    isActive: boolean;
    createdAt?:  Date;
}

export interface DoctorApplyResponseDTO {
    message: string;
    application: DoctorApplicationDTO
}

export interface DoctorStatusResponseDTO {
    status:   DoctorStatus;
    application: DoctorApplicationDTO;
    name: string;
    verificationRemarks?: string;
}