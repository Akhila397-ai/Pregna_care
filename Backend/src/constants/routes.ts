export const ROUTES = {
    AUTH: {
        BASE: "/api/auth",
        SIGNUP: "/register",
        LOGIN: "/login",
        VERIFY_OTP: "/verify-otp",
        RESEND_OTP: "/resend-otp",
        ME: "/me",
        REFRESH_TOKEN: "/refresh-token",
        FORGOT_PASSWORD: "/forgot-password",
        VERIFY_FORGOT_OTP: "/verify-forgot-otp",
        RESET_PASSWORD: "/reset-password",
        GOOGLE_LOGIN: "/google-login"
    },
    ADMIN: {
        BASE: "/api/admin",
        LOGIN: "/login",
        USERS: "/users",
        PENDINGS: "/pending",
        BLOCK: "/block/:id"
    },
    DOCTOR: {
        BASE: "/api/doctor",
        APPLY: "/apply",

    }
}