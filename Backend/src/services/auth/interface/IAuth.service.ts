import { AuthResponseDTO, OTPResponseDTO,MessageResponseDTO, VerifyOtpResponseDTO } from "../../../dtos/auth.dto.js";



export interface IAUthService {
    register(name: string,email: string, password: string): Promise<OTPResponseDTO>;
    verifyOtp(email: string, otp: string, purpose: string): Promise<VerifyOtpResponseDTO>
    login(email: string, password: string): Promise<AuthResponseDTO>;
    forgotPassword(email: string): Promise<OTPResponseDTO>;
    resetPassword(email: string, newPassword: string): Promise<MessageResponseDTO>;
    resendOtp(email: string, purpose: string): Promise<OTPResponseDTO>;
}