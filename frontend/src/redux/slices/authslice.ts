import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = "user" | "admin" | "doctor";

interface AuthState {
  userId: string | null;
  role: Role | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ userId: string; role: Role }>
    ) => {
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.userId = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;