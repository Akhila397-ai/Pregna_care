import { env } from "../config/env.js";
export const TOKEN_EXPIRY = {
    ACCESS_TOKEN: "15m",
    REFRESH_TOKEN: "7d",
    RESET_TOKEN: "10m",
    OTP_SECONDS: 300, // 5 minutes
};
export const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
export const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
    path: "/",
};
export const CLEAR_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};
//# sourceMappingURL=cookie.constant.js.map