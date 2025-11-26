import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  perPage: 20,
};

const cpUnlockHistoryAdminSlice = createSlice({
  name: "cpUnlockHistoryAdmin",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    resetCpUnlockHistoryFilters: () => initialState,
  },
});

export const { setPage, setPerPage, resetCpUnlockHistoryFilters } =
  cpUnlockHistoryAdminSlice.actions;

export default cpUnlockHistoryAdminSlice.reducer;
