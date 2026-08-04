import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi }                      from '../../features/admin/api/admin.api';
import {
  AdminLoginRequest,
  AdminAuthResponse,
  IUserMappedData,
  IDoctorMappedData,
} from '../../features/admin/types/admin.types';
import { DoctorStatus } from '../../features/doctor/types/doctor.types';

interface AdminState {
  users:  IUserMappedData[];
  totalUsers: number;
  totalPages: number;

  doctors: IDoctorMappedData[];
  totalDoctors:  number;
  doctorPages:  number;

  loading:  boolean;
  error: string | null;
}

const initialState: AdminState = {
  users:        [],
  totalUsers:   0,
  totalPages:   0,
  doctors:      [],
  totalDoctors: 0,
  doctorPages:  0,
  loading:      false,
  error:        null,
};

// ── Thunks ────────────────────────────────────


export const getUsersThunk = createAsyncThunk(
  'admin/getUsers',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      return await adminApi.getAllUsers(page, limit);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch users.');
    }
  }
);

export const blockUserThunk = createAsyncThunk(
  'admin/blockUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await adminApi.blockUser(userId);
      return userId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to block user.');
    }
  }
);

export const unblockUserThunk = createAsyncThunk(
  'admin/unblockUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await adminApi.unblockUser(userId);
      return userId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to unblock user.');
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  'admin/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await adminApi.deleteUser(userId);
      return userId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete user.');
    }
  }
);

export const getDoctorsThunk = createAsyncThunk(
  'admin/getDoctors',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      return await adminApi.getAllDoctors(page, limit);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch doctors.');
    }
  }
);

export const verifyDoctorThunk = createAsyncThunk(
  'admin/verifyDoctor',
  async(
    {
      doctorId,
      action,
      remarks
    }: {
      doctorId: string;
      action:'approve' | 'reject' | 'more_documents_required' | 'under_review';
      remarks?: string;
    },
    {rejectWithValue}

  ) => {
    try {
      await adminApi.verifyDoctor(doctorId,action,remarks);
      return { doctorId,action};
    } catch (error) {
       return rejectWithValue(
        error.response?.data?.error || 'Verification failed.'
      );
    }
  }
)

export const approveDoctorThunk = createAsyncThunk(
  'admin/approveDoctor',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      await adminApi.approveDoctor(doctorId);
      return doctorId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to approve doctor.');
    }
  }
);

export const rejectDoctorThunk = createAsyncThunk(
  'admin/rejectDoctor',
  async(
    {doctorId, rejectionReason}: { doctorId: string, rejectionReason: string},
    {rejectWithValue}
  ) => {
    try {
      await adminApi.rejectDoctor(doctorId, rejectionReason);
      return doctorId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to reject doctor.'
      );
    }
  }
)

export const blockDoctorThunk = createAsyncThunk(
  'admin/blockDoctor',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      await adminApi.blockDoctor(doctorId);
      return doctorId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to block doctor.');
    }
  }
);

export const unblockDoctorThunk = createAsyncThunk(
  'admin/unblockDoctor',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      await adminApi.unblockDoctor(doctorId);
      return doctorId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to unblock doctor.');
    }
  }
);

export const deleteDoctorThunk = createAsyncThunk(
  'admin/deleteDoctor',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      await adminApi.deleteDoctor(doctorId);
      return doctorId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete doctor.');
    }
  }
);

// ── Slice ─────────────────────────────────────
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
   clearAdminData: (state) => {
    state.users = [];
    state.totalUsers = 0;
    state.totalPages = 0;
    state.doctors = []
    state.totalDoctors = 0;
    state.doctorPages = 0;
    state.error = null;
   },
   clearAdminError: (state) => {
    state.error = null;
   },
  },
  extraReducers: (builder) => {

    // ── Get Users ──────────────────────────────
    builder
      .addCase(getUsersThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.loading     = false;
        state.users       = action.payload.users;
        state.totalUsers  = action.payload.totalUsers;
        state.totalPages  = action.payload.totalPages;
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });

      builder
      .addCase(verifyDoctorThunk.fulfilled,(state,action) => {
        const {doctorId, action: act} = action.payload;
        const doctor = state.doctors.find((d)=> d._id === doctorId)
        if(doctor){
          const statusMap = {
            approve: 'approved',
            reject: 'rejected',
            more_documents_required: 'more_documents_required',
            under_review:'under_review'
          } as const;
          doctor.status = statusMap[act];
        }
      })

    // ── Block User ─────────────────────────────
    builder
      .addCase(blockUserThunk.fulfilled, (state, action) => {
        const user = state.users.find((u) => u._id === action.payload);
        if (user) user.isBlocked = true;
      });

    // ── Unblock User ───────────────────────────
    builder
      .addCase(unblockUserThunk.fulfilled, (state, action) => {
        const user = state.users.find((u) => u._id === action.payload);
        if (user) user.isBlocked = false;
      });

    // ── Delete User ────────────────────────────
    builder
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });

    // ── Get Doctors ────────────────────────────
    builder
      .addCase(getDoctorsThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(getDoctorsThunk.fulfilled, (state, action) => {
        state.loading       = false;
        state.doctors       = action.payload.doctors;
        state.totalDoctors  = action.payload.totalDoctors;
        state.doctorPages   = action.payload.totalPages;
      })
      .addCase(getDoctorsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });

    // ── Approve Doctor ─────────────────────────
    builder
      .addCase(approveDoctorThunk.fulfilled, (state, action) => {
        const doc = state.doctors.find((d) => d._id === action.payload);
        if (doc) doc.status === 'approved';
      });

    // ── Reject Doctor ──────────────────────────
    builder
      .addCase(rejectDoctorThunk.fulfilled, (state, action) => {
        const doc = state.doctors.find((d) => d._id === action.payload);
        if (doc) doc.status === 'rejected';
      });

    // ── Block Doctor ───────────────────────────
    builder
      .addCase(blockDoctorThunk.fulfilled, (state, action) => {
        const doc = state.doctors.find((d) => d._id === action.payload);
        if (doc) doc.isBlocked = true;
      });

    // ── Unblock Doctor ─────────────────────────
    builder
      .addCase(unblockDoctorThunk.fulfilled, (state, action) => {
        const doc = state.doctors.find((d) => d._id === action.payload);
        if (doc) doc.isBlocked = false;
      });

    // ── Delete Doctor ──────────────────────────
    builder
      .addCase(deleteDoctorThunk.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter((d) => d._id !== action.payload);
      });
  },
});

export const { clearAdminData, clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;