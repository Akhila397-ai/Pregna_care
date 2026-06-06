export type OTPPurpose = 'signup' | 'login' | 'forgot_password' | 'resend_otp' ;

export interface otpData {
    userId: string;
    otpHash: string;
    purpose: OTPPurpose;
    attempts: number;
    isUsed: boolean;
    createdAt: Date;
}