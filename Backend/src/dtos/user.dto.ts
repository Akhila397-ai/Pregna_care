import { EmergencyContactRelationship, onboardingType } from "../types/user.js";

export interface EmergencyContactDTO {
    id: string;
    name: string;
    phoneNumber: string;
    relationship: EmergencyContactRelationship;
    createdAt?: Date;
}

export interface AddEmergencyContactDTO {
    name: string;
    phoneNumber: string;
    relationship: EmergencyContactRelationship;
}

export interface UpdateEmergencyContactDTO {
    name: string;
    phoneNumber: string;
    relationship: EmergencyContactRelationship;
}

export interface UserAuthDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    isVerified: boolean;
    isOnboarded: boolean;
    onboardingType: onboardingType;
    lmpDate?: Date;
    periodStartDate?: Date;
    cycleLength?: number;
    emergencyContacts?: EmergencyContactDTO[];
}

export interface UserProfileDTO extends UserAuthDTO {
    phone?: string;
    imageUrl?: string;
    createdAt?: Date;
}

export interface SetOnboardingDTO {
    onboardingType: onboardingType;
}

export interface SetPregnancyLMPDTO {
    lmpDate: string;
}

export interface PregnancyDetailsDTO {
    lmpDate: Date;
    gestationalAge: {
        weeks: number;
        days: number;
    };
    weeks: number;
    days: number;
    formattedAge: string;
    trimester: number;
    estimatedDueDate: Date;
    daysRemaining: number;
    babySize: string;
    progressPercent: number;
}

export interface SetCycleInfoDTO {
    periodStartDate: string;
    cycleLength?: number;
    periodLength?: number;
}

export interface CycleDetailsDTO {
    periodStartDate: Date;
    cycleLength: number;
    periodLength: number;
    currentCycleDay: number;
    ovulationDay: number;
    isFertile: boolean;
    daysUntilNextPeriod: number;
    nextPeriodDate: Date;
    fertileStartDate: Date;
    fertileEndDate: Date;
}