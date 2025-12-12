import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  per_page: 10,
  search: "",
  is_active: null,
  is_featured: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.per_page = action.payload;
      state.page = 1; // Reset to page 1
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setIsActive: (state, action) => {
      state.is_active = action.payload;
      state.page = 1;
    },
    setIsFeatured: (state, action) => {
      state.is_featured = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.search = "";
      state.is_active = null;
      state.is_featured = null;
      state.page = 1;
    },
  },
});

export const {
  setPage,
  setPerPage,
  setSearch,
  setIsActive,
  setIsFeatured,
  resetFilters,
} = brandSlice.actions;

export default brandSlice.reducer;
