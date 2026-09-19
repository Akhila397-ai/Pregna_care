import { AuthResponseDTO, OTPResponseDTO, MessageResponseDTO, VerifyOtpResponseDTO, LoginDTO } from "../../../dtos/auth.dto.js";
import { UserAuthDTO } from "../../../dtos/user.dto.js";
import { onboardingType } from "../../../types/user.js";
export interface IAUthService {
    register(name: string, email: string, password: string): Promise<OTPResponseDTO>;
    verifyOtp(email: string, otp: string, purpose: string): Promise<VerifyOtpResponseDTO>;
    login(data: LoginDTO): Promise<AuthResponseDTO>;
    forgotPassword(email: string): Promise<OTPResponseDTO>;
    resetPassword(email: string, newPassword: string): Promise<MessageResponseDTO>;
    resendOtp(email: string, purpose: string): Promise<OTPResponseDTO>;
    refreshToken(userId: string): Promise<AuthResponseDTO>;
    setOnboarding(userId: string, onboardingType: onboardingType): Promise<MessageResponseDTO>;
    getMe(userId: string): Promise<UserAuthDTO>;
}
//# sourceMappingURL=IAuth.service.d.ts.map