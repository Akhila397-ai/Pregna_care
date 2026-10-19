export type UserRole = 'user' | 'admin' | 'doctor';
export declare const ROLE_PORTAL_NAMES: Record<UserRole, string>;
export interface JWTPayload {
    userId: string;
    role?: UserRole;
    purpose?: string;
    iat?: number;
    exp?: number;
}
//# sourceMappingURL=roles.d.ts.map