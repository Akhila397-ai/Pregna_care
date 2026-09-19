import { UserAuthDTO } from "./user.dto.js";
import { UserRole } from "../types/roles.js";
export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}
export interface LoginDTO {
    email: string;
    password: string;
    expectedRole: UserRole;
}
export interface AuthResponseDTO {
    user: UserAuthDTO;
    token: string;
    refreshToken?: string;
}
export interface OTPResponseDTO {
    message: string;
    expiresIn: number;
}
export interface MessageResponseDTO {
    message: string;
}
export interface ResetTokenDTO {
    token: string;
}
export type VerifyOtpResponseDTO = AuthResponseDTO | ResetTokenDTO;
//# sourceMappingURL=auth.dto.d.ts.map