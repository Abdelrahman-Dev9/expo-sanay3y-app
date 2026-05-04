import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  resetToken: string | null;
}

const initialState: AuthState = {
  resetToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setResetToken: (state, action: PayloadAction<string>) => {
      state.resetToken = action.payload;
    },
    clearResetToken: (state) => {
      state.resetToken = null;
    },
  },
});

export const { setResetToken, clearResetToken } = authSlice.actions;
export default authSlice.reducer;
