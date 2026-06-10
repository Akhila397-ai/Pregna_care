import { data } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import {
   RegisterRequest,
   LoginRequest,
   VerifyOTPRequest,
   ForgotPasswordRequest,
   ResendOTPRequest,
   ResetPasswordREquest,
   AuthResponse,
   OTPResponse,
   MessageResponse 
} from '../types/auth.types'
import ForgotPasswordPage from "../pages/ForgotPassword";

export const authApi = {

    register: async (data: RegisterRequest): Promise<OTPResponse> => {
        const res = await axiosInstance.post('/auth/register',data)
        return res.data
    },

    verifyOTP: async (data: VerifyOTPRequest): Promise<AuthResponse> => {
        const res = await axiosInstance.post('/auth/verify-otp',data)
        return res.data
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const res = await axiosInstance.post('/auth/login',data)
        return res.data
    },

    forgotPassword: async (data: ForgotPasswordRequest): Promise<OTPResponse> => {
        const res = await axiosInstance.post('/auth/forgot-password',data)
        return res.data
    },

    resetPassword: async (data: ResetPasswordREquest): Promise<MessageResponse> => {
        const res = await axiosInstance.post('/auth/reset-password',data)
        return res.data
    },

    resendOTP: async (data: ResendOTPRequest): Promise<OTPResponse> => {
        const res = await axiosInstance.post('/auth/resend-otp',data)
        return res.data
    }

    
}