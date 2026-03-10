import { Role } from "../enums/role.enum.js";
import { UserStatus } from "../enums/userStatus.enum.js";
import { Document } from "mongoose";


export interface IUser {
    name: string,
    email: string,
    password: string,
    role: Role,
    status: UserStatus,
    isVerified: boolean,
    otp?: string | null | undefined;
    otpExpiry?: Date | null | undefined;
    lastLogin?: Date | null;
    otpRequestedAt: Date;
    otpAttempts: number;

}