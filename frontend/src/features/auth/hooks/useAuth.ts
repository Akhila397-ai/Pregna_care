import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  registerThunk,
  verifyOTPThunk,
  loginThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  resendOTPThunk,
  refreshTokenThunk,
  setOnboardingThunk,
  logout,
  clearError,
} from '@/app/store/slices/auth.slice';
import { OnboardingType, UserRole } from '../types/auth.types';
import axiosInstance from '@/shared/api/axiosInstance';
import { clearAdminData } from '@/app/store/slices/admin.slice';
import { clearDoctorState } from '@/features/doctor/store/doctor.slice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
    user,
    token,
    pendingEmail,
    otpPurpose,
    otpSent,
    resetToken,
  } = useAppSelector((state) => state.auth);

  // ── Register ──────────────────────────────────
  const register = async (name: string, email: string, password: string) => {
    const result = await dispatch(registerThunk({ name, email, password }));
    if (registerThunk.fulfilled.match(result)) {
      navigate('/verify-otp');
    }
  };

  // ── Verify OTP ────────────────────────────────
  const verifyOTP = async (otp: string) => {
    const result = await dispatch(
      verifyOTPThunk({
        email: pendingEmail || '',
        otp,
        purpose: otpPurpose || 'signup',
      })
    );
    if (verifyOTPThunk.fulfilled.match(result)) {
      if (otpPurpose === 'forgot_password') {
        navigate('/reset-password');
      } else {
        navigate('/dashboard');
      }
    }
  };

  // ── Login(All roles) ──────────────────────────
  const login = async (email: string, password: string, expectedRole: UserRole) => {
    const result = await dispatch(loginThunk({ email, password, expectedRole }));

    if (loginThunk.fulfilled.match(result)) {
      const { role, isOnboarded, onboardingType } = result.payload.user;

      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
        return;
      }

      if (role === 'doctor') {
        try {
          const statusRes = await axiosInstance.get('/doctor/my-status');
          const status = statusRes.data.status;
          if (status === 'approved') {
            navigate('/doctor/dashboard', { replace: true });
          } else if (status === 'rejected') {
            navigate('/doctor/rejected', { replace: true });
          } else {
            navigate('/doctor/pending', { replace: true });
          }
        } catch {
          navigate('/doctor/pending', { replace: true });
        }
        return;
      }

      // Regular user navigation (no unwanted doctor status calls)
      if (!isOnboarded) {
        navigate('/onboarding', { replace: true });
      } else if (onboardingType === 'pregnant') {
        navigate('/dashboard/pregnancy', { replace: true });
      } else if (onboardingType === 'trying') {
        navigate('/dashboard/menstruation', { replace: true });
      } else if (onboardingType === 'exploring') {
        navigate('/dashboard/explore', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  };

  // ── Forgot Password ───────────────────────────
  const forgotPassword = async (email: string) => {
    const result = await dispatch(forgotPasswordThunk({ email }));
    if (forgotPasswordThunk.fulfilled.match(result)) {
      navigate('/verify-otp');
    }
  };

  // ── Reset Password ────────────────────────────
  const resetPassword = async (newPassword: string) => {
    const result = await dispatch(
      resetPasswordThunk({
        newPassword,
        resetToken: resetToken || '',
      })
    );

    if (resetPasswordThunk.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  // ── Resend OTP ────────────────────────────────
  const resendOTP = async () => {
    await dispatch(
      resendOTPThunk({
        email: pendingEmail || '',
        purpose: otpPurpose || 'signup',
      })
    );
  };

  const refreshToken = async () => {
    const result = await dispatch(refreshTokenThunk());
    if (refreshTokenThunk.fulfilled.match(result)) {
      const role = result.payload.user.role;
      if (role === 'doctor') navigate('/doctor/dashboard');
    }
  };

  const selectOnboarding = async (type: OnboardingType) => {
    const result = await dispatch(setOnboardingThunk({ onboardingType: type }));
    if (setOnboardingThunk.fulfilled.match(result)) {
      if (type === 'pregnant') {
        navigate('/onboarding/pregnant');
      } else if (type === 'trying') {
        navigate('/onboarding/trying');
      } else if (type === 'doctor') {
        navigate('/doctor/apply');
      } else if (type === 'exploring') {
        navigate('/dashboard/explore');
      }
    }
  };

  // ── Logout ────────────────────────────────────
  const logoutUser = () => {
    dispatch(logout());
    dispatch(clearAdminData());
    dispatch(clearDoctorState());
    navigate('/login');
  };

  return {
    user,
    token,
    loading,
    error,
    otpSent,
    pendingEmail,
    register,
    verifyOTP,
    login,
    forgotPassword,
    resetPassword,
    resendOTP,
    refreshToken,
    selectOnboarding,
    logoutUser,
    clearError: () => dispatch(clearError()),
  };
};