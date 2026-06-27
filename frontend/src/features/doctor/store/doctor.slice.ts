import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { doctorApi } from '../api/doctor.api';
import { DoctorApplicationResponse, DoctorApplyRequest,DoctorApplyResponse,DoctorProfileResponse,DoctorStatus,DoctorStatusResponse } from '../types/doctor.types';
import { loadConfigFromFile } from 'vite';
import { act } from 'react';



interface DoctorState {
    application:  DoctorApplicationResponse | null;
    profile:      DoctorProfileResponse  | null;
    status:       DoctorStatus | null;
    token:       string | null;
    loading:  boolean;
    error: string | null;
}

const initialState: DoctorState = {
    application: null,
    profile: null,
    status: null,
    token:  localStorage.getItem('doctorToken'),
    loading:  false,
    error: null
}



export const doctorApplyThunk = createAsyncThunk(
    'doctor/apply',
    async (data: DoctorApplyRequest, { rejectWithValue}) => {
        try {
            return await doctorApi.apply(data)
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Application Failed'
            )
            
        }
    }
)

export const getMyStatusThunk = createAsyncThunk(
    'doctor/getMyStatus',
    async (__dirname,{ rejectWithValue}) => {
        try {
            return await doctorApi.getMyStatus()
        } catch (error) {
            return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch status.'
      );
        }
    }
)

export const getApplicationThunk = createAsyncThunk(
    'doctor/getMyApplication',
    async (__dirname, { rejectWithValue}) => {
        try {
            return await doctorApi.getMyApplication()
        } catch (error: any) {
           return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch application.'
      ); 
        }
    }
)

export const getMyProfileThunk = createAsyncThunk(
    'doctor/getMyProfile',
    async(_, {rejectWithValue}) => {
        try {
            return await  doctorApi.getMyProfile();
        } catch (error: any) {
            return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch profile.'
      );
        }
    }
)

//slice
const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        doctorLogout: (state) => {
            state.application = null;
            state.profile = null;
            state.token = null;
            localStorage.removeItem('doctorToken')
        },
        clearDoctorError: (state) => {
            state.error = null
        }
    },

    extraReducers: (builder) => {
        //apply
        builder
        .addCase(doctorApplyThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(doctorApplyThunk.fulfilled,(state,action) => {
            state.loading = false;
            state.application = action.payload.application;
            state.token = action.payload.token;
            localStorage.setItem('doctorToken',action.payload.token)
        })
        .addCase(doctorApplyThunk.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        //get status
        builder
        .addCase(getMyStatusThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getMyStatusThunk.fulfilled,((state,action) => {
            state.loading = false;
            state.status = action.payload.status;
            state.application = action.payload.application;
        }))
        .addCase(getMyStatusThunk.rejected,(state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })


        //getApplication

        builder
        .addCase(getApplicationThunk.pending,(state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(getApplicationThunk.fulfilled,(state,action)=> {
            state.loading = false;
            state.application = action.payload;
        })
        .addCase(getApplicationThunk.rejected,(state,action)=> {
            state.loading = false;
            state.error = action.payload as string;
        })

        //get Profile

        builder
        .addCase(getMyProfileThunk.pending,(state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(getMyProfileThunk.fulfilled,(state,action)=> {
            state.loading = false;
            state.profile = action.payload;
        })
        .addCase(getMyProfileThunk.rejected,(state,action)=> {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
})


export const {doctorLogout, clearDoctorError} = doctorSlice.actions;
export default doctorSlice.reducer;