export interface RegisterRequest {
    name: string;
    email: string;
    password: string
}

export interface LoginRequest {
    email: string;
    password: string
}

export interface VerifyOTPRequest {
    email: string;
    otp: string;
    purpose: string
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordREquest {
    email: string;
    otp: string;
    newPassword: string
}
export interface ResendOTPRequest {
    email: string;
    purpose: string
}

//Response Type
export interface UserAuthResponse {
    id: string;
    name: string;
    email: string;
    isBlocked: boolean;
    isVerified: boolean
}

export interface AuthResponse {
    user: UserAuthResponse;
    token: string
}

export interface OTPResponse {
    message: string;
    expiresIn: number
}

export interface MessageResponse {
    message: string;
}