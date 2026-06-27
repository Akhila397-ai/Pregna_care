export const ROUTES = {

  AUTH: {
    BASE:               '/api/auth',
    SIGNUP:             '/register',
    LOGIN:              '/login',
    VERIFY_OTP:         '/verify-otp',
    RESEND_OTP:         '/resend-otp',
    FORGOT_PASSWORD:    '/forgot-password',
    RESET_PASSWORD:     '/reset-password',
    REFRESH_TOKEN:      '/refresh-token',
    ME:                 '/me',
  },

  ADMIN: {
    BASE:               '/api/admin',

    // ── User Management ────────────────────────
    USERS:              '/users',
    BLOCK_USER:         '/users/:userId/block',
    UNBLOCK_USER:       '/users/:userId/unblock',
    DELETE_USER:        '/users/:userId',

    // ── Doctor Management ──────────────────────
    DOCTORS:            '/doctors',
    APPROVE_DOCTOR:     '/doctors/:doctorId/approve',
    REJECT_DOCTOR:      '/doctors/:doctorId/reject',
    BLOCK_DOCTOR:       '/doctors/:doctorId/block',
    UNBLOCK_DOCTOR:     '/doctors/:doctorId/unblock',
    DELETE_DOCTOR:      '/doctors/:doctorId',
    
  },

  DOCTOR: {
    BASE:               '/api/doctor',
    APPLY:              '/apply',
    MY_APPLICATION:  '/my-application',  // GET  — check application status
    MY_PROFILE:      '/my-profile', 
    MY_STATUS: '/my-status'
  },

} as const;