export declare const ROUTES: {
    readonly AUTH: {
        readonly BASE: "/api/auth";
        readonly SIGNUP: "/register";
        readonly LOGIN: "/login";
        readonly VERIFY_OTP: "/verify-otp";
        readonly RESEND_OTP: "/resend-otp";
        readonly FORGOT_PASSWORD: "/forgot-password";
        readonly RESET_PASSWORD: "/reset-password";
        readonly REFRESH_TOKEN: "/refresh-token";
        readonly ME: "/me";
        readonly SET_ONBOARDING: "/set-onboarding";
    };
    readonly ADMIN: {
        readonly BASE: "/api/admin";
        readonly USERS: "/users";
        readonly BLOCK_USER: "/users/:userId/block";
        readonly UNBLOCK_USER: "/users/:userId/unblock";
        readonly DELETE_USER: "/users/:userId";
        readonly DOCTORS: "/doctors";
        readonly GETDOCTORDOCUMENT: "/doctors/:doctorId/document/:documentType";
        readonly VERIFY_DOCTOR: "/doctors/:doctorId/verify";
        readonly APPROVE_DOCTOR: "/doctors/:doctorId/approve";
        readonly REJECT_DOCTOR: "/doctors/:doctorId/reject";
        readonly BLOCK_DOCTOR: "/doctors/:doctorId/block";
        readonly UNBLOCK_DOCTOR: "/doctors/:doctorId/unblock";
        readonly DELETE_DOCTOR: "/doctors/:doctorId";
    };
    readonly DOCTOR: {
        readonly BASE: "/api/doctor";
        readonly APPLY: "/apply";
        readonly MY_APPLICATION: "/my-application";
        readonly MY_PROFILE: "/my-profile";
        readonly MY_STATUS: "/my-status";
        readonly MY_DASHBOARD: "/my-dashboard";
    };
};
//# sourceMappingURL=routes.d.ts.map