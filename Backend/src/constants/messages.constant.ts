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

  //user related
  FIELDS_REQUIRED: "All fields are required",
  INVALID_NAME: "Name must only contain at least 4 characters",
  INVALID_EMAIL: "Invalid email format",
  INVALID_PASSWORD:
    "Password must be at least 8 characters long, contain at least 1 letter, 1 number, and 1 special character",
  EMAIL_ALREADY_EXISTS: "Email already registered",
  USER_NOT_FOUND: "User not found",
  REGISTER_SUCCESS: "Registered successfully",
  LOGIN_SUCCESS: "User logged in successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  REFRESH_TOKEN_MISSING: "No refresh token provided",
  REFRESH_TOKEN_INVALID: "Invalid refresh token",
  REFRESH_TOKEN_FAILED: "Token verification failed",
}