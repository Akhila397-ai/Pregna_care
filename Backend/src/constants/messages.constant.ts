export const HttpResponse = {
  OK: "OK",
  SERVER_ERROR: "Internal server error",
  CREATED: "Created successfully",
  BAD_REQUEST: "Invalid request",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden access",
  NOT_FOUND: "Resource not found",

//otp

  OTP_SENT: "OTP sent to email",
  OTP_SEND_FAILED: "OTP sending failed",
  OTP_INVALID: "Invalid OTP",
  OTP_VERIFIED: "OTP verified successfully",
  OTP_RESENT: "OTP resent successfully",
  OTP_NOT_FOUND: "No pending OTP found",
  OTP_EXPIRED_OR_INVALID: "OTP not verified or expired",
  OTP_MAX_ATTEMPTS: "Maximum attempts!!",
  //User Management
  FIELDS_REQUIRED: "All fields are required",
  INVALID_NAME: "Name must only contain at least 4 characters",
  PASSWORD_RESET_SUCCESSFULL: "Password reset seccessfull",
  INVALID_EMAIL: "Invalid email format",
  FORGOT_PASSWORD_SENT:'otp for forgott password has been sent',
  INVALID_PASSWORD:
    "=Invalid Password",
  EMAIL_ALREADY_EXISTS: "Email already registered",
  USER_NOT_FOUND: "User not found",
  REGISTER_SUCCESS: "Registered successfully",
  LOGIN_SUCCESS: "User logged in successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  REFRESH_TOKEN_MISSING: "No refresh token provided",
  REFRESH_TOKEN_INVALID: "Invalid refresh token",
  REFRESH_TOKEN_FAILED: "Token verification failed",
  VERIFY_YOUR_ACCOUNT: "Please verify your account first",
  TOKEN_EXPIRED: "Role based auth",
  USER_BLOCKED: "User has been blocked by the admin",
  RESET_TOKEN_MISSING: "Reset token not found",
  INVALID_RESET_TOKEN:"Invalid reset token",
  RESET_EXPIRED:"Reset token expired",
  //Admin Management

  ADMIN_NOT_FOUND:        'Admin account not found.',
  ADMIN_INACTIVE:         'Admin account is inactive.',

  //User Management
  USER_BLOCK_SUCCESS:     'User has been blocked successfully.',
  USER_UNBLOCK_SUCCESS:   'User has been unblocked successfully.',
  USER_DELETE_SUCCESS:    'User has been deleted successfully.',


  //Doctor Management 
  DOCTOR_NOT_FOUND:       'Doctor not found.',
  DOCTOR_APPROVED:        'Doctor has been approved successfully.',
  DOCTOR_REJECTED:        'Doctor has been rejected successfully.',
  DOCTOR_BLOCK_SUCCESS:   'Doctor has been blocked successfully.',
  DOCTOR_UNBLOCK_SUCCESS: 'Doctor has been unblocked successfully.',
  DOCTOR_DELETE_SUCCESS:  'Doctor has been deleted successfully.',

}