import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null, role: null, id: null },
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, role, id } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.role = role;
      state.id = id;
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.id = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrectUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => state.auth.role;
export const selectcurrentId = (state) => state.auth.id;
