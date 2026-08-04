export type UserRole = 'user' | 'admin' | 'doctor';


export const ROLE_PORTAL_NAMES: Record<UserRole, string> = {
  user:   'User Login',
  doctor: 'Doctor Login (/doctor/login)',
  admin:  'Admin Login (/admin/login)',
};
export interface JWTPayload {
    userId: string;
    role?: UserRole;
    purpose?: string;
    iat?: number;
    exp?: number;
}