import { onboardingType } from "../types/user.js";

export interface UserAuthDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    isVerified: boolean;
    isOnboarded: boolean;
    onboardingType: onboardingType;
}

export interface UserProfileDTO extends UserAuthDTO {
    phone?: string;
    imageUrl?: string;
    createdAt?: Date;
}

export interface SetOnboardingDTO {
    onboardingType: onboardingType
}