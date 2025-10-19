import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    search: "",
    status: "",
  },
  pagination: {
    currentPage: 1,
  },
};

const adminStaffSlice = createSlice({
  name: "adminStaff",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1;
    },
    setStatus(state, action) {
      state.filters.status = action.payload;
      state.pagination.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
    resetFilters(state) {
      state.filters = { search: "", status: "" };
      state.pagination.currentPage = 1;
    },
  },
});

export const { setSearch, setStatus, setCurrentPage, resetFilters } =
  adminStaffSlice.actions;
export default adminStaffSlice.reducer;
