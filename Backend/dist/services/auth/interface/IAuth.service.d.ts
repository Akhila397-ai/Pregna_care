import { AuthResponseDTO, OTPResponseDTO, MessageResponseDTO, VerifyOtpResponseDTO, LoginDTO } from "../../../dtos/auth.dto.js";
import { UserAuthDTO, PregnancyDetailsDTO, CycleDetailsDTO, EmergencyContactDTO, AddEmergencyContactDTO, UpdateEmergencyContactDTO } from "../../../dtos/user.dto.js";
import { onboardingType } from "../../../types/user.js";
export interface IAUthService {
    register(name: string, email: string, password: string): Promise<OTPResponseDTO>;
    verifyOtp(email: string, otp: string, purpose: string): Promise<VerifyOtpResponseDTO>;
    login(data: LoginDTO): Promise<AuthResponseDTO>;
    forgotPassword(email: string): Promise<OTPResponseDTO>;
    resetPassword(email: string, newPassword: string): Promise<MessageResponseDTO>;
    resendOtp(email: string, purpose: string): Promise<OTPResponseDTO>;
    refreshToken(refreshToken: string): Promise<AuthResponseDTO>;
    setOnboarding(userId: string, onboardingType: onboardingType): Promise<MessageResponseDTO>;
    getMe(userId: string): Promise<UserAuthDTO>;
    setPregnancyLMP(userId: string, lmpDate: string): Promise<PregnancyDetailsDTO>;
    getPregnancyDetails(userId: string): Promise<PregnancyDetailsDTO | null>;
    setCycleInfo(userId: string, periodStartDate: string, cycleLength?: number, periodLength?: number): Promise<CycleDetailsDTO>;
    getCycleDetails(userId: string): Promise<CycleDetailsDTO | null>;
    getEmergencyContacts(userId: string): Promise<EmergencyContactDTO[]>;
    addEmergencyContact(userId: string, data: AddEmergencyContactDTO): Promise<EmergencyContactDTO[]>;
    updateEmergencyContact(userId: string, contactId: string, data: UpdateEmergencyContactDTO): Promise<EmergencyContactDTO[]>;
    deleteEmergencyContact(userId: string, contactId: string): Promise<EmergencyContactDTO[]>;
    logout(refreshToken?: string): Promise<MessageResponseDTO>;
}
//# sourceMappingURL=IAuth.service.d.ts.map