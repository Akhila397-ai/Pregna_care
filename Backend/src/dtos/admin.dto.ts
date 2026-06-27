import { DoctorStatus } from "../types/doctor.js";

export interface IUserMappedData {
    _id:  string;
    userId: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    isDeleted:  boolean;
    isVerified: boolean;
    imageUrl?: string;
    mobileNumber?: string;
    createdAt: Date;
}

export interface GetMappedUsersResponse {
    users: IUserMappedData[];
    totalUsers: number;
    totalPages: number;
}


//adminAuth
export interface AdminAuthDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    isVerified: boolean;
}

export interface AdminAuthResponseDTO {
    admin: AdminAuthDTO;
    token: string
}

//doctor managment

export interface IDoctorsMappedData {
    _id: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    qualification: string;
    experience: number;
    registrationNumber: string;
    consultationFee: number;
    clinicName: string;
    clinicAddress: string;
    availability: {
        days: string[];
        startTime: string;
        endTime: string;
    }
    documents: string[];
    status: DoctorStatus;
    rejectionReason?: string;
    isBlocked: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    approvedBy?:  string;
    approvedAt?: Date;
    imageUrl?: string;
    specialization?: string;
    createdAt?: Date ;
}

export interface GetMappedDoctorsResponse {
    doctors: IDoctorsMappedData[];
    totalDoctors: number;
    totalPages: number;
}