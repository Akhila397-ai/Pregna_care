export type UserRole = 'user' | 'admin' | 'doctor';

export interface JWTPayload {
    userId: string;
    role?: UserRole;
    purpose?: string;
    iat?: number;
    exp?: number;
}