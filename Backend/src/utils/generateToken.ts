import jwt from 'jsonwebtoken'
import { JWTPayload } from '../types/roles.js';
import { UserRole } from '../types/roles.js';


export const generateAccessToken = (
    userId: string,
    role: UserRole
): string => {
    return jwt.sign(
        {userId, role},
        process.env.JWT_SECRET!,
        {expiresIn: '15m'}
    )
}

export const generateRefreshToken = (userId: string): string => {
    console.log("SIGN SECRET:", process.env.JWT_RESET_SECRET);
    return  jwt.sign(
        {userId},
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d'}
    )
};

export const verifyAccessToken = (token: string): JWTPayload => {
    return jwt.verify(
        token,
        process.env.JWT_SECRET!
    ) as JWTPayload
}

export const verifyRefreshToken = (
    token: string
): {userId: string} => {
    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!

    )as { userId: string}
}

