import { NumericLiteral } from "typescript";
import { DoctorStatus } from "../../doctor/types/doctor.types";

export interface AdminLoginRequest {
    email: string;
    password: string;
}


export interface IUserMappedData {
    _id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    imageUrl?: string;
    mobileNumber?: string;
    createdAt?: Date;
}


export interface getMappedUsersResponse {
    users: IUserMappedData[];
    totalUsers: number;
    totalPages: number;
}

export interface IDoctorMappedData {
        _id:             string;
        userId:          string;
        fullName:            string;
        email:           string;
        phone: string;
        specialization:  string;
        qualification: string;
        experience: number;
        registrationNumber: string;
        consultationFee: number;
        clinicName: string;
        clinicAddress: string;
        profileImage:  string;
        documents:  string[];
        availabilty: {
          days:  string[];
          startTime: string;
          endTime: string;
        }
        status: DoctorStatus;
        rejectionReason?: string;
        isBlocked: boolean;
        isVerified: boolean;
        isDeleted: boolean;
        approvedBy?: string;
        approvedAt?: string;
        createdAt?: string;
}
export interface GetMappedDoctorsResponse {
  doctors:      IDoctorMappedData[];
  totalDoctors: number;
  totalPages:   number;
}
export interface IAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isVerified: boolean;
}


export interface AdminAuthResponse {
  user: IAdmin;
  token: string;
  name: string;
}

export interface AdminLoginResponse {
  user:  AdminAuthResponse;
  token: string;
}


