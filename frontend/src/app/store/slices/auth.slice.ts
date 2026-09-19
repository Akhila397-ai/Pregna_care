import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/features/auth/api/auth.api';
import {
  RegisterRequest,
  LoginRequest,
  VerifyOTPRequest,
  ForgotPasswordRequest,
  UserAuthResponse,
  SetOnboardingRequest,
} from '@/features/auth/types/auth.types';
import { AxiosError } from 'axios';

interface AuthState {
  user: UserAuthResponse | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  pendingEmail: string | null;
  otpPurpose: string | null;
  resetToken: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: sessionStorage.getItem('accessToken'),
  loading: false,
  resetToken: null,
  error: null,
  otpSent: false,
  pendingEmail: null,
  otpPurpose: null,
  initialized: false,
};

// ── Thunks ────────────────────────────────────

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      return { ...res, email: data.email };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const verifyOTPThunk = createAsyncThunk(
  'auth/verifyOTP',
  async (data: VerifyOTPRequest, { rejectWithValue }) => {
    try {
      return await authApi.verifyOTP(data);
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      return rejectWithValue(err.response?.data?.error || 'OTP verification failed.');
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      return await authApi.login(data);
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      return rejectWithValue(err.response?.data?.error || 'Login Failed');
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async (data: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.forgotPassword(data);
      return { ...res, email: data.email };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      return rejectWithValue(err.response?.data?.error || 'Failed to send OTP.');
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async (
    data: {
      newPassword: string;
      resetToken: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await authApi.resetPassword(data.newPassword, data.resetToken);
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      return rejectWithValue(err.response?.data?.error || 'Password reset failed.');
    }
  }
);

export const resendOTPThunk = createAsyncThunk(
  'auth/resendOTP',
  async (data: { email: string; purpose: string }, { rejectWithValue }) => {
    try {
      return await authApi.resendOTP(data);
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      return rejectWithValue(err.response?.data?.error || 'Failed to resend OTP.');
    }
  }
);

export const refreshTokenThunk = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    return await authApi.refreshToken();
  } catch (error: unknown) {
    const err = error as AxiosError<{ error?: string; message?: string }>;
    return rejectWithValue(err.response?.data?.error || 'Failed to refresh token.');
  }
});

export const setOnboardingThunk = createAsyncThunk(
  'auth/setOnboarding',
  async (data: SetOnboardingRequest, { rejectWithValue }) => {
    try {
      await authApi.setOnboarding(data);
      return data.onboardingType;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      return rejectWithValue(err.response?.data?.error || 'Failed to set onboarding.');
    }
  }
);

export const getMeThunk = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const result = await authApi.getMe();
    return result;
  } catch (error: unknown) {
    const err = error as AxiosError<{ error?: string; message?: string }>;
    return rejectWithValue(err.response?.data?.error || 'Session expired.');
  }
});

// ── Slice ─────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.pendingEmail = null;
      state.otpPurpose = null;
      state.initialized = true;
      sessionStorage.removeItem('accessToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    // ── Register ──────────────────────────────
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.pendingEmail = action.payload.email;
        state.otpPurpose = 'signup';
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Verify OTP ────────────────────────────
    builder
      .addCase(verifyOTPThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTPThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = false;

        if (state.otpPurpose === 'signup') {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.pendingEmail = null;
          state.otpPurpose = null;
        }

        if (state.otpPurpose === 'forgot_password') {
          state.resetToken = action.payload.token;
        }
      })
      .addCase(verifyOTPThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Login ─────────────────────────────────
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.initialized = true;
        sessionStorage.setItem('accessToken', action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Forgot Password ───────────────────────
    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.pendingEmail = action.payload.email;
        state.otpPurpose = 'forgot_password';
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Reset Password ────────────────────────
    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.pendingEmail = null;
        state.otpPurpose = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Resend OTP ────────────────────────────
    builder
      .addCase(resendOTPThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTPThunk.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(resendOTPThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Refresh Token ─────────────────────────
    builder
      .addCase(refreshTokenThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        sessionStorage.setItem('accessToken', action.payload.token);
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Set Onboarding ────────────────────────
    builder
      .addCase(setOnboardingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setOnboardingThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.isOnboarded = true;
          state.user.onboardingType = action.payload;
        }
      })
      .addCase(setOnboardingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Get Me ────────────────────────────────
    builder
      .addCase(getMeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(getMeThunk.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.token = null;
        sessionStorage.removeItem('accessToken');
      });
  },
});

export const { logout, clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
