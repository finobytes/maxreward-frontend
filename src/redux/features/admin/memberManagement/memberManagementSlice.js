// src/redux/features/admin/memberManagement/memberManagementSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  memberType: "", // '' means all
  status: "all", // 'all' | 'active' | 'blocked' | 'suspended'
  page: 1,
  perPage: 10,
  sortBy: "created_at",
  sortOrder: "desc",
};

const slice = createSlice({
  name: "memberManagement",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setMemberType(state, action) {
      state.memberType = action.payload;
      state.page = 1;
    },
    setStatus(state, action) {
      state.status = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
      state.page = 1;
    },
    setSort(state, action) {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
      state.page = 1;
    },
    resetFilters(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSearch,
  setMemberType,
  setStatus,
  setPage,
  setPerPage,
  setSort,
  resetFilters,
} = slice.actions;

export default slice.reducer;
