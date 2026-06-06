
export interface SignupPayload {
    name: string,
    email: string,
    password: string
}

export interface Verifypayload {
    email: string,
    otp: string
}

export interface LoginRequest {
  email: string;
  password: string;
}


export interface LoginResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin" | "doctor";
  };
  accessToken: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
}
export enum Role {
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    ADMIN = 'admin'
}
export enum UserStatus{
    ACTIVE = 'active',
    BLOCKED = 'blocked'
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

