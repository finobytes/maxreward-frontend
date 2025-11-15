import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  memberId: null,
  page: 1,
  search: "",
  status: "all",
};

const purchaseManagementSlice = createSlice({
  name: "purchaseManagement",
  initialState,
  reducers: {
    setMemberId: (state, action) => {
      state.memberId = action.payload ?? null;
    },
    setPage: (state, action) => {
      const nextPage = Number(action.payload) || 1;
      state.page = nextPage < 1 ? 1 : nextPage;
    },
    setSearch: (state, action) => {
      state.search = action.payload ?? "";
      state.page = 1;
    },
    setStatus: (state, action) => {
      state.status = action.payload || "all";
      state.page = 1;
    },
    resetFilters: () => ({ ...initialState }),
  },
});

export const { setMemberId, setPage, setSearch, setStatus, resetFilters } =
  purchaseManagementSlice.actions;

export default purchaseManagementSlice.reducer;
