import { api } from "./api";
import { LoginRequest, LoginResponse, SignupPayload, Verifypayload, ForgotPasswordRequest,
  VerifyOtpRequest, ResetPasswordRequest
 } from "../types/auth.types";



export const signupUser = async (data: SignupPayload) => {
    const res = await api.post('/auth/signup',data);
    return res.data
}


export const verifyOtp = async (data: Verifypayload) => {
    const res = await api.post('/auth/verify-otp',data)
    return res.data
}


export const resendOtp = async (email: string) => {
  const res = await api.post("/auth/resend-otp", { email });
  return res.data;
};

export const handleGoogleLogin = async (token: string):Promise<{success:boolean,message: string}> => {
  const res = await api.post("/auth/google-login",{token})
  return res.data
}

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post("/auth/login",data)
  return res.data
}

export const forgotPassword = async (data: ForgotPasswordRequest) => {
  const res = await api.post("/auth/forgot-password",data)
  return res.data
}

export const verifyForgotOtp = async (data: VerifyOtpRequest) => {
  const res = await api.post("/auth/verify-forgot-otp", data)
  return res.data
}

export const resetPassword = async (data: ResetPasswordRequest) => {
  const res = await api.post("/auth/reset-password",data)
  return res.data
}



