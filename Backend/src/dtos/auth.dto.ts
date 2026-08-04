import { UserAuthDTO } from "./user.dto.js";
import { OTPPurpose } from "../types/otp.js";
import { UserRole } from "../types/roles.js";

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email:  string;
    password: string;
    expectedRole: UserRole;
}


//responsedto

export interface AuthResponseDTO {
    user: UserAuthDTO;
    token: string;
    
}

export interface OTPResponseDTO {
    message: string;
    expiresIn: number;
}

export interface MessageResponseDTO {
    message: string;
}

export interface ResetTokenDTO {
    token: string
}

export type VerifyOtpResponseDTO =
  | AuthResponseDTO
  | ResetTokenDTO;