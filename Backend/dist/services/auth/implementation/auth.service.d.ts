import "reflect-metadata";
import type { IUserRepository } from "../../../repositories/auth/interface/IUser.repository.js";
import type { IOtpRepository } from "../../../repositories/otp/interface/IOtp.repository.js";
import type { IEmailService } from "../../email/interface/IEmail.service.js";
import { IAUthService } from "../interface/IAuth.service.js";
import { AuthResponseDTO, MessageResponseDTO, OTPResponseDTO, VerifyOtpResponseDTO, LoginDTO } from "../../../dtos/auth.dto.js";
import { UserAuthDTO } from "../../../dtos/user.dto.js";
import { onboardingType } from "../../../types/user.js";
export declare class AuthService implements IAUthService {
    private userRepository;
    private otpRepository;
    private emailService;
    constructor(userRepository: IUserRepository, otpRepository: IOtpRepository, emailService: IEmailService);
    register(name: string, email: string, password: string): Promise<OTPResponseDTO>;
    verifyOtp(email: string, otp: string, purpose: string): Promise<VerifyOtpResponseDTO>;
    login(data: LoginDTO): Promise<AuthResponseDTO>;
    private _getPortalErrorMessage;
    forgotPassword(email: string): Promise<OTPResponseDTO>;
    resetPassword(userId: string, newPassword: string): Promise<MessageResponseDTO>;
    resendOtp(email: string, purpose: string): Promise<OTPResponseDTO>;
    refreshToken(userId: string): Promise<AuthResponseDTO>;
    setOnboarding(userId: string, onboardingType: onboardingType): Promise<MessageResponseDTO>;
    getMe(userId: string): Promise<UserAuthDTO>;
    private _sendOTP;
    private _verifyOtp;
}
//# sourceMappingURL=auth.service.d.ts.map