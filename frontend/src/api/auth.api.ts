import { api } from "./api";
import { SignupPayload, Verifypayload } from "../types/auth.types";


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

export const googleSignup = async (token: string) => {
  const res = await api.post("/auth/google-auth", { token });
  return res.data;
};