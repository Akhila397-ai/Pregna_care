import axiosInstance from '@/shared/api/axiosInstance';
import {
  RegisterRequest,
  LoginRequest,
  VerifyOTPRequest,
  ForgotPasswordRequest,
  ResendOTPRequest,
  AuthResponse,
  OTPResponse,
  MessageResponse,
  SetOnboardingRequest,
  UserAuthResponse,
  SetPregnancyLMPRequest,
  PregnancyDetailsResponse,
  SetCycleInfoRequest,
  CycleDetailsResponse,
  AddEmergencyContactRequest,
  UpdateEmergencyContactRequest,
  EmergencyContactsResponse,
} from '../types/auth.types';


export const authApi = {
  register: async (data: RegisterRequest): Promise<OTPResponse> => {
    const res = await axiosInstance.post('/auth/register', data);
    return res.data;
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post('/auth/verify-otp', data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post('/auth/login', data);
    return res.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<OTPResponse> => {
    const res = await axiosInstance.post('/auth/forgot-password', data);
    return res.data;
  },

  resetPassword: async (newPassword: string, resetToken: string): Promise<MessageResponse> => {
    const res = await axiosInstance.post(
      '/auth/reset-password',
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${resetToken}`,
        },
      }
    );
    return res.data;
  },

  resendOTP: async (data: ResendOTPRequest): Promise<OTPResponse> => {
    const res = await axiosInstance.post('/auth/resend-otp', data);
    return res.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const res = await axiosInstance.post('/auth/refresh-token');
    return res.data;
  },
  logout: async (): Promise<MessageResponse> => {
    const res = await axiosInstance.post('/auth/logout');
    return res.data
  },

  setOnboarding: async (data: SetOnboardingRequest): Promise<MessageResponse> => {
    const res = await axiosInstance.post('/auth/set-onboarding', data);
    return res.data;
  },

  getMe: async (): Promise<UserAuthResponse> => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
  },

  setPregnancyLMP: async (data: SetPregnancyLMPRequest): Promise<PregnancyDetailsResponse> => {
    const res = await axiosInstance.post('/auth/pregnancy/lmp', data);
    return res.data;
  },

  getPregnancyDetails: async (): Promise<PregnancyDetailsResponse> => {
    const res = await axiosInstance.get('/auth/pregnancy/details');
    return res.data;
  },

  setCycleInfo: async (data: SetCycleInfoRequest): Promise<CycleDetailsResponse> => {
    const res = await axiosInstance.post('/auth/cycle/setup', data);
    return res.data;
  },

  getCycleDetails: async (): Promise<CycleDetailsResponse> => {
    const res = await axiosInstance.get('/auth/cycle/details');
    return res.data;
  },

  getEmergencyContacts: async (): Promise<EmergencyContactsResponse> => {
    const res = await axiosInstance.get('/auth/emergency-contacts');
    return res.data;
  },

  addEmergencyContact: async (data: AddEmergencyContactRequest): Promise<EmergencyContactsResponse> => {
    const res = await axiosInstance.post('/auth/emergency-contacts', data);
    return res.data;
  },

  updateEmergencyContact: async (
    contactId: string,
    data: UpdateEmergencyContactRequest
  ): Promise<EmergencyContactsResponse> => {
    const res = await axiosInstance.put(`/auth/emergency-contacts/${contactId}`, data);
    return res.data;
  },

  deleteEmergencyContact: async (contactId: string): Promise<EmergencyContactsResponse> => {
    const res = await axiosInstance.delete(`/auth/emergency-contacts/${contactId}`);
    return res.data;
  },
};