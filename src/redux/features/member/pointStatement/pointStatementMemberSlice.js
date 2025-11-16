import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  perPage: 20,
};

const pointStatementMemberSlice = createSlice({
  name: "pointStatementMember",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    resetPointStatementFilters: () => initialState,
  },
});

export const { setPage, setPerPage, resetPointStatementFilters } =
  pointStatementMemberSlice.actions;

export default pointStatementMemberSlice.reducer;
