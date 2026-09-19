import { JWTPayload } from "../types/roles.js";
export declare const generateAccessToken: (userId: string, role?: string) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const generateResetToken: (userId: string) => string;
export declare const verifyAccessToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => {
    userId: string;
};
export declare const verifyResetToken: (token: string) => JWTPayload;
//# sourceMappingURL=jwt.d.ts.map