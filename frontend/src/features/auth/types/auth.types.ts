export type OnboardingType = 'pregnant' | 'trying' | 'doctor' | 'exploring' | null;
export type UserRole = 'user' | 'doctor' | 'admin';

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string; 
    password: string;
    expectedRole: UserRole;
}

export interface VerifyOTPRequest {
    email: string;
    otp: string;
    purpose: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordREquest {
    email: string;
    otp: string;
    newPassword: string;
}

export interface ResendOTPRequest {
    email: string;
    purpose: string;
}

export interface SetOnboardingRequest {
    onboardingType: OnboardingType;
}

export interface SetPregnancyLMPRequest {
    lmpDate: string;
}

export interface PregnancyDetailsResponse {
    lmpDate: string;
    gestationalAge?: {
        weeks: number;
        days: number;
    };
    weeks: number;
    days: number;
    formattedAge: string;
    trimester: number;
    estimatedDueDate: string;
    daysRemaining: number;
    babySize: string;
    progressPercent: number;
}

export interface SetCycleInfoRequest {
    periodStartDate: string;
    cycleLength?: number;
    periodLength?: number;
}

export interface CycleDetailsResponse {
    periodStartDate: string;
    cycleLength: number;
    periodLength: number;
    currentCycleDay: number;
    ovulationDay: number;
    isFertile: boolean;
    daysUntilNextPeriod: number;
    nextPeriodDate: string;
    fertileStartDate: string;
    fertileEndDate: string;
}

export type EmergencyRelationship =
  | 'Parent'
  | 'Husband / Spouse'
  | 'Partner'
  | 'Family Member'
  | 'Friend'
  | 'Other';

export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
  relationship: EmergencyRelationship;
  createdAt?: string;
}

export interface AddEmergencyContactRequest {
  name: string;
  phoneNumber: string;
  relationship: EmergencyRelationship;
}

export interface UpdateEmergencyContactRequest {
  name: string;
  phoneNumber: string;
  relationship: EmergencyRelationship;
}

export interface EmergencyContactsResponse {
  message?: string;
  emergencyContacts: EmergencyContact[];
}

export interface UserAuthResponse {
    id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    isVerified: boolean;
    isOnboarded: boolean;
    onboardingType: OnboardingType;
    lmpDate?: string;
    periodStartDate?: string;
    cycleLength?: number;
    emergencyContacts?: EmergencyContact[];
}

export interface AuthResponse {
    user: UserAuthResponse;
    token: string;
}

export interface OTPResponse {
    message: string;
    expiresIn: number;
}

export interface MessageResponse {
    message: string;
}