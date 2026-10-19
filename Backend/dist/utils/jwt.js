import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const generateAccessToken = (userId, role) => {
    const options = { expiresIn: "15m" };
    return jwt.sign({ userId, role: role }, env.JWT_SECRET, options);
};
export const generateRefreshToken = (userId) => {
    const options = { expiresIn: "7d" };
    return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, options);
};
export const generateResetToken = (userId) => {
    const options = { expiresIn: "10m" };
    return jwt.sign({
        userId,
        purpose: "password-reset",
    }, env.JWT_RESET_SECRET, options);
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.JWT_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
export const verifyResetToken = (token) => {
    return jwt.verify(token, env.JWT_RESET_SECRET);
};
//# sourceMappingURL=jwt.js.map