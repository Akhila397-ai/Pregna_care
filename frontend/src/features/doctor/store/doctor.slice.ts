import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorApi } from '../api/doctor.api';
import {
  DoctorApplyFormData,
  DoctorApplicationResponse,
  DoctorDashboardResponse,
  DoctorStatus,
} from '../types/doctor.types';
import { RootState } from '@/app/store';
import { AxiosError } from 'axios';

interface DoctorState {
  application: DoctorApplicationResponse | null;
  dashboard: DoctorDashboardResponse | null;
  status: DoctorStatus | null;
  name: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  application: null,
  dashboard: null,
  status: null,
  name: null,
  loading: false,
  error: null,
};

// ── Thunks ────────────────────────────────────

export const doctorApplyThunk = createAsyncThunk(
  'doctor/apply',
  async (data: DoctorApplyFormData, { rejectWithValue }) => {
    try {
      return await doctorApi.apply(data);
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;
      return rejectWithValue(err.response?.data?.error || 'Application failed.');
    }
  }
);

export const getMyStatusThunk = createAsyncThunk(
  'doctor/getMyStatus',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const user = state.auth.user;
      if (!user) {
        return rejectWithValue('No user logged in.');
      }

      if (user.role === 'admin') {
        return rejectWithValue('Admin cannot check doctor status.');
      }

      return await doctorApi.getMyStatus();
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch status.');
    }
  }
);

export const getMyDashboardThunk = createAsyncThunk(
  'doctor/getMyDashboard',
  async (_, { rejectWithValue }) => {
    try {
      return await doctorApi.getMyDashboard();
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch dashboard.');
    }
  }
);

// ── Slice ─────────────────────────────────────
const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearDoctorState: (state) => {
      state.application = null;
      state.dashboard = null;
      state.status = null;
      state.name = null;
      state.error = null;
    },
    clearDoctorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Apply ──────────────────────────────────
    builder
      .addCase(doctorApplyThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doctorApplyThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.application = action.payload.application;
        state.status = 'pending';
      })
      .addCase(doctorApplyThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Get Status ─────────────────────────────
    builder
      .addCase(getMyStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.application = action.payload.application;
        state.name = action.payload.name;
      })
      .addCase(getMyStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Get Dashboard ──────────────────────────
    builder
      .addCase(getMyDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
        state.name = action.payload.name;
      })
      .addCase(getMyDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDoctorState, clearDoctorError } = doctorSlice.actions;
export default doctorSlice.reducer;