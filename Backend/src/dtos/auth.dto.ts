import { UserAuthDTO } from "./user.dto.js";
import { OTPPurpose } from "../types/otp.js";

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
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