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
   _id:    string;
  userId: string;

  // ← from User
  name:       string;
  email:      string;
  phone?:     string;
  imageUrl?:  string;
  isBlocked:  boolean;
  isDeleted:  boolean;
  isVerified: boolean;

  // ← from DoctorApplication
  fullName:           string;
  specialization:     string;
  qualification:      string;
  experience:         number;
  registrationNumber: string;
  consultationFee:    number;
  clinicName:         string;
  clinicAddress:      string;
  availability: {
    days:      string[];
    startTime: string;
    endTime:   string;
  };

  // ← presigned URLs
  profileImage?:               string;  
  degreeCertificateUrl?:       string;
  registrationCertificateUrl?: string;
  governmentIdUrl?:            string;

  status:               DoctorStatus;
  verificationRemarks?: string;
  verifiedBy?:          string;
  verifiedAt?:          Date;
  createdAt?:           Date;


}

export interface GetMappedDoctorsResponse {
    doctors: IDoctorsMappedData[];
    totalDoctors: number;
    totalPages: number;
}

export interface VerifyDoctorDTO {
    action: 'approve' | 'reject' | 'more_documents_required' | 'under_review';
    remarks?: string;
}