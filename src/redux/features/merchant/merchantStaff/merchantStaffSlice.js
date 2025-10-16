import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allStaffs: [],
  filteredStaffs: [],
  search: "",
  status: "",
  sortBy: "created_at",
  sortOrder: "desc",
  currentPage: 1,
  perPage: 10,
};

const merchantStaffSlice = createSlice({
  name: "merchantStaff",
  initialState,
  reducers: {
    setAllStaffs: (state, action) => {
      state.allStaffs = action.payload;
      state.filteredStaffs = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload.toLowerCase();
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    /** ✅ Added resetFilters reducer */
    resetFilters: (state) => {
      state.search = "";
      state.status = "";
      state.sortBy = "created_at";
      state.sortOrder = "desc";
      state.currentPage = 1;
      state.perPage = 10;
    },
  },
});

export const {
  setAllStaffs,
  setSearch,
  setStatus,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  setPerPage,
  resetFilters, // ✅ Now exported correctly
} = merchantStaffSlice.actions;

export default merchantStaffSlice.reducer;
