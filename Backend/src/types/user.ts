import { UserRole } from "./roles.js";
export interface userData {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: UserRole;
    isBlocked: boolean;
    isVerified: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    imageUrl: string;
}