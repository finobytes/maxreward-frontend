import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagination: {
    page: 1,
    per_page: 10,
  },
  filters: {
    status: "",
    business_type: "",
    search: "",
  },
};

const merchantManagementSlice = createSlice({
  name: "merchantManagement",
  initialState,
  reducers: {
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setPagination, setFilters, resetFilters } =
  merchantManagementSlice.actions;
export default merchantManagementSlice.reducer;
