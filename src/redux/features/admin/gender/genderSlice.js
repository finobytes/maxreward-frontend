import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  per_page: 10,
  search: "",
  is_active: null,
};

const genderSlice = createSlice({
  name: "gender",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.per_page = action.payload;
      state.page = 1;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setIsActive: (state, action) => {
      state.is_active = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.search = "";
      state.is_active = null;
      state.page = 1;
    },
  },
});

export const { setPage, setPerPage, setSearch, setIsActive, resetFilters } =
  genderSlice.actions;

export default genderSlice.reducer;
