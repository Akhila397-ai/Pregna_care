import { configureStore } from '@reduxjs/toolkit';
import authReducer        from './slices/auth.slice';
import adminReducer from './slices/admin.slice'
import doctorReducer from '../features/doctor/store/doctor.slice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    doctor: doctorReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;