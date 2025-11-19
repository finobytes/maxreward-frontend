import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  perPage: 20,
};

const cpTransactionMemberSlice = createSlice({
  name: "cpTransactionMember",
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
  cpTransactionMemberSlice.actions;

export default cpTransactionMemberSlice.reducer;
