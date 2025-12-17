import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    search: "",
    status: "", // "pending", "approved", "rejected", or empty for all
    category_id: "",
    brand_id: "",
  },
  pagination: {
    currentPage: 1,
    perPage: 10,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1; // Reset to page 1 on filter change
    },
    setStatus: (state, action) => {
      state.filters.status = action.payload;
      state.pagination.currentPage = 1;
    },
    setCategory: (state, action) => {
      state.filters.category_id = action.payload;
      state.pagination.currentPage = 1;
    },
    setBrand: (state, action) => {
      state.filters.brand_id = action.payload;
      state.pagination.currentPage = 1;
    },
    setOriginalArgs: (state, action) => {
      // Optional: to keep track of other args if needed
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination = initialState.pagination;
    },
  },
});

export const {
  setSearch,
  setStatus,
  setCategory,
  setBrand,
  setCurrentPage,
  resetFilters,
} = productSlice.actions;

export default productSlice.reducer;
