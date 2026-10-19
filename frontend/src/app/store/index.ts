import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import adminReducer from './slices/admin.slice';
import doctorReducer from '@/features/doctor/store/doctor.slice';

const traceMiddleware: Middleware = () => (next) => (action: unknown) => {
  if (import.meta.env.DEV && typeof action === 'object' && action !== null && 'type' in action) {
    const act = action as { type: string };
    if (
      typeof act.type === 'string' &&
      (act.type.includes('doctor/getMyStatus') || act.type.includes('doctor/getMyDashboard'))
    ) {
      console.group(`[Redux] ${act.type}`);
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
    getDefaultMiddleware().concat(import.meta.env.DEV ? [traceMiddleware] : []),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
