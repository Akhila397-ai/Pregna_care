import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer        from './slices/auth.slice';
import adminReducer from './slices/admin.slice'
import doctorReducer from '../features/doctor/store/doctor.slice'

const traceMiddleware: Middleware = () => (next) => (action: any) => {
  if (
    action.type === 'doctor/getMyStatus/pending' ||
    action.type === 'doctor/getMyDashboard/pending'
  ) {
    console.group(`🔴 [Redux] ${action.type}`);
    console.trace('dispatched from:');
    console.groupEnd();
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