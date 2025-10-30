import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  success: false,
  error: null,
  newMember: null,
};

const referNewMemberSlice = createSlice({
  name: "referNewMember",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    setSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.newMember = action.payload;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetReferNewMember: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.newMember = null;
    },
  },
});

export const { setLoading, setSuccess, setError, resetReferNewMember } =
  referNewMemberSlice.actions;

export default referNewMemberSlice.reducer;
