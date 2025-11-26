import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  perPage: 20,
};

const cpTransactionAdminSlice = createSlice({
  name: "cpTransactionAdmin",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    resetCpTransactionFilters: () => initialState,
  },
});

export const { setPage, setPerPage, resetCpTransactionFilters } =
  cpTransactionAdminSlice.actions;

export default cpTransactionAdminSlice.reducer;
