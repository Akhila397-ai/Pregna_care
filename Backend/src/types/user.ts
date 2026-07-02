import { UserRole } from "./roles.js";

export type onboardingType = 'pregnant' | 'trying' | 'doctor' | 'exploring' | null;
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
    onboardingType: onboardingType;
    isOnboarded: boolean;
}