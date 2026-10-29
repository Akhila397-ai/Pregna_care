import { UserRole } from "./roles.js";
export type onboardingType = 'pregnant' | 'trying' | 'doctor' | 'exploring' | null;
export type EmergencyContactRelationship = 'Parent' | 'Husband / Spouse' | 'Partner' | 'Family Member' | 'Friend' | 'Other';
export interface IEmergencyContact {
    _id?: any;
    name: string;
    phoneNumber: string;
    relationship: EmergencyContactRelationship;
    createdAt?: Date;
}
export interface userData {
    name: string;
    email: string;
    phone?: string;
    fullName: string;
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
    lmpDate?: Date;
    periodStartDate?: Date;
    cycleLength?: number;
    periodLength?: number;
    emergencyContacts?: IEmergencyContact[];
    primaryDoctorId?: any;
    refreshToken?: string;
    refreshTokenHash?: string;
}
//# sourceMappingURL=user.d.ts.map