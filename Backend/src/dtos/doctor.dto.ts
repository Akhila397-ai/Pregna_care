import { DoctorStatus, Availability } from "../types/doctor.js";


export interface DoctorApplyDTO {
    fullName:  string;
    email:     string;
    password:  string;
    phone:     string;
    specialization:  string;
    qualification:   string;
    experience:      string;
    registrationNumber:  string;
    consultationFee: number;
    clinicName: string;
    clinicAddress: string;
    profileImage: string;
    documents: string[];
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
    email: string;
    phone: string;
    specialization: string;
    qualification: string;
    experience: string;
    registrationNumber: string;
    consultationFee: number;
    clinicName: string;
    clinicAddress: string;
    profileImage: string;
    documents: string[];
    availability: Availability;
    status:  DoctorStatus;
    rejectionReason?: string;
    approvedBy?: string;
    approvedAt?:  Date;
    createdAt?: Date;
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
    token: string;
    application: DoctorApplicationDTO
}

export interface DoctorStatusResponseDTO {
    status:   DoctorStatus;
    application: DoctorApplicationDTO;
    rejectionReason?: string;
}