import { DoctorStatus } from '../../doctor/types/doctor.types';

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
      _id:    string;
  userId: string;

  name:       string;
  email:      string;
  phone?:     string;
  imageUrl?:  string;
  isBlocked:  boolean;
  isDeleted:  boolean;
  isVerified: boolean;

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
  profileImage: string,
  status:               DoctorStatus;
  verificationRemarks?: string;
  verifiedBy?:          string;
  verifiedAt?:          Date;
  createdAt?:           Date;

  // ← S3 keys (not presigned URLs)
  degreeCertificateKey?:       string;
  registrationCertificateKey?: string;
  governmentIdKey?:            string;

  // ← existence flags
  hasDegreeCertificate:       boolean;
  hasRegistrationCertificate: boolean;
  hasGovernmentId:            boolean;

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

export interface DocumentPresignedUrl {
  url: string;
  expiresIn: number;
  key: string;
}

export type DocumentType =
  | 'degreeCertificate'
  | 'registrationCertificate'
  | 'governmentId';

