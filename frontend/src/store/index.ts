import { configureStore } from '@reduxjs/toolkit';
import authReducer        from './slices/auth.slice';
import adminReducer from './slices/admin.slice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;