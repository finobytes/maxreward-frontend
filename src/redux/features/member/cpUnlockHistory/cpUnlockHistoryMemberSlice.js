import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  perPage: 20,
};

const cpUnlockHistoryMemberSlice = createSlice({
  name: "cpUnlockHistoryMember",
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
  cpUnlockHistoryMemberSlice.actions;

export default cpUnlockHistoryMemberSlice.reducer;
