import { useNavigate }       from 'react-router-dom';
import { useAppDispatch,
         useAppSelector }    from '../../../store/hooks';
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
}                            from '../../../store/slices/auth.slice';
import { OnboardingType } from '../types/auth.types';

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
    resetToken
  } = useAppSelector((state) => state.auth);

  // ── Register ──────────────────────────────────
  const register = async (
    name:     string,
    email:    string,
    password: string
  ) => {
    const result = await dispatch(
      registerThunk({ name, email, password })
    );
    if (registerThunk.fulfilled.match(result)) {
      navigate('/verify-otp');
    }
  };

  // ── Verify OTP ────────────────────────────────
  const verifyOTP = async (otp: string) => {
    const result = await dispatch(
      verifyOTPThunk({
        email:   pendingEmail || '',
        otp,
        purpose: otpPurpose  || 'signup',
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

  // ── Login ─────────────────────────────────────
  const login = async (email: string, password: string) => {
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      navigate('/onboarding');
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
const resetPassword = async (
  newPassword: string
) => {

  console.log("RESET TOKEN IN STORE:", resetToken);

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
        email:   pendingEmail || '',
        purpose: otpPurpose  || 'signup',
      })
    );
  };

  const refreshToken = async () => {
    const result = await dispatch(refreshTokenThunk());
    if(refreshTokenThunk.fulfilled.match(result)){
      const role = result.payload.user.role;
      if(role === 'doctor') navigate('/doctor/dashboard')
    }
  }

  const selectOnboarding = async (type: OnboardingType) => {
    const result = await dispatch(setOnboardingThunk({onboardingType: type}));
    if(setOnboardingThunk.fulfilled.match(result)){
      if(type === 'pregnant'){
        navigate('/onboarding/pregnant')
      }else if(type === 'trying'){
        navigate('/onboarding/trying')
      }else if(type === 'doctor'){
        navigate('/apply');
      }else if(type === 'exploring'){
        navigate('/dashboard/explore')
      }
    }
  }

  // ── Logout ────────────────────────────────────
  const logoutUser = () => {
    dispatch(logout());
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