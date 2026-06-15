import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  role: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  role: "user",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.role = "user";
    },
    changeRole(state, action: PayloadAction<string>) {
      state.role = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
