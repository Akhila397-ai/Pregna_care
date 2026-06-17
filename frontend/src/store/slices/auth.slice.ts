import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi }                       from '../../features/auth/api/auth.api';
import {
  RegisterRequest,
  LoginRequest,
  VerifyOTPRequest,
  ForgotPasswordRequest,
  ResetPasswordREquest,
  ResendOTPRequest,
  UserAuthResponse,
} from '../../features/auth/types/auth.types';
import { AxiosError } from 'axios';


interface AuthState {
  user:         UserAuthResponse | null;
  token:        string | null;
  loading:      boolean;
  error:        string | null;
  otpSent:      boolean;
  pendingEmail: string | null;
  otpPurpose:   string | null;
  resetToken: string | null;
}

const initialState: AuthState = {
  user:         null,
  token:        localStorage.getItem('accessToken'),
  loading:      false,
   resetToken: null,
  error:        null,
  otpSent:      false,
  pendingEmail: null,
  otpPurpose:   null,
};

// ── Thunks ────────────────────────────────────

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      return { ...res, email: data.email };
    } catch (error: unknown) {
        const err = error as AxiosError<string>;
      return rejectWithValue(
        err.response?.data || "Registration failed"
      );
    }
  }
);

export const verifyOTPThunk = createAsyncThunk(
  'auth/verifyOTP',
  async (data: VerifyOTPRequest, { rejectWithValue }) => {
    try {
      return await authApi.verifyOTP(data);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'OTP verification failed.'
      );
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      return await authApi.login(data);
    } catch (err: any) {
      // console.log('FULL ERROR:', err);
      // console.log('err.response:', err.response);
      // console.log('err.response.data:', err.response?.data);
      // console.log('err.response.status:', err.response?.status);
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data ||
        'Login failed.'
      );
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async (data: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.forgotPassword(data);
      return { ...res, email: data.email };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to send OTP.'
      );
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
      return await authApi.resetPassword(
        data.newPassword,
        data.resetToken
      );
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
        'Password reset failed.'
      );
    }
  }
);

export const resendOTPThunk = createAsyncThunk(
  'auth/resendOTP',
  async (data: ResendOTPRequest, { rejectWithValue }) => {
    try {
      return await authApi.resendOTP(data);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to resend OTP.'
      );
    }
  }
);

// ── Slice ─────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user         = null;
      state.token        = null;
      state.pendingEmail = null;
      state.otpPurpose   = null;
      localStorage.removeItem('accessToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {

    // ── Register ──────────────────────────────
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading      = false;
        state.otpSent      = true;
        state.pendingEmail = action.payload.email;
        state.otpPurpose   = 'signup';
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });

    // ── Verify OTP ────────────────────────────
    builder
      .addCase(verifyOTPThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(verifyOTPThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = false;
        console.log("VERIFY OTP RESPONSE:", action.payload);

        if (state.otpPurpose === 'signup') {
          state.user = action.payload.user;
          state.token = action.payload.token;

          state.pendingEmail = null;
          state.otpPurpose = null;
        }

        if (state.otpPurpose === 'forgot_password') {
          console.log("OTP RESPONSE:", action.payload);
          state.resetToken = action.payload.token;
        }
      })
      .addCase(verifyOTPThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });

    // ── Login ─────────────────────────────────
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload.user;
        state.token   = action.payload.token;
        localStorage.setItem('accessToken', action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });

    // ── Forgot Password ───────────────────────
    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        state.loading      = false;
        state.otpSent      = true;
        state.pendingEmail = action.payload.email;
        state.otpPurpose   = 'forgot_password';
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });

    // ── Reset Password ────────────────────────
    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading      = false;
        state.pendingEmail = null;
        state.otpPurpose   = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
        
      });


    // ── Resend OTP ────────────────────────────
    builder
      .addCase(resendOTPThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(resendOTPThunk.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(resendOTPThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;