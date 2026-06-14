export type UserRole = 'user' | 'admin' | 'doctor';

export interface JWTPayload {
    userId: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}