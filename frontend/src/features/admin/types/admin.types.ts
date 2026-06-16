

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
        name:            string;
        email:           string;
        role:            string;
        isBlocked:       boolean;
        isDeleted:       boolean;
        isVerified:      boolean;
        isApproved:      boolean;
        imageUrl?:       string;
        mobileNumber?:   string;
        specialization?: string;
        createdAt?:      string;
        qualification: string;
        experience: number;
        licenseCertificate: string;
        status: "pending" | "approved" | "rejected";
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


