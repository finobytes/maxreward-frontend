import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

const initialState = {
  user: storedUser || null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;

      // 🔹 Fake login logic
      if (email === "admin@demo.com" && password === "Admin@123") {
        state.user = { email, role: "admin" };
      } else if (email === "member@demo.com" && password === "Member@123") {
        state.user = { email, role: "member" };
      } else if (email === "merchant@demo.com" && password === "Merchant@123") {
        state.user = { email, role: "merchant" };
      } else {
        state.user = null;
      }

      if (state.user) {
        state.isAuthenticated = true;
        state.token = "fake-jwt-token-" + Date.now();

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", state.token);
      } else {
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
