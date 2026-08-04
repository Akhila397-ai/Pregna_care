import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer        from './slices/auth.slice';
import adminReducer from './slices/admin.slice'
import doctorReducer from '../features/doctor/store/doctor.slice'

const traceMiddleware: Middleware = () => (next) => (action: any) => {
  if (process.env.NODE_ENV === 'development') {
    if (
      typeof action.type === 'string' &&
      (action.type.includes('doctor/getMyStatus') ||
       action.type.includes('doctor/getMyDashboard'))
    ) {
      console.group(`[Redux] ${action.type}`);
      console.trace();
      console.groupEnd();
    }
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    doctor: doctorReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(
    process.env.NODE_ENV === 'development' ? [traceMiddleware] : []
    ),
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;