import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  per_page: 10,
  search: "",
};

const businessTypeSlice = createSlice({
  name: "businessType",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.per_page = action.payload;
      state.page = 1; // reset page when per page changes
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.page = 1;
      state.per_page = 10;
      state.search = "";
    },
  },
});

export const { setPage, setPerPage, setSearch, resetFilters } =
  businessTypeSlice.actions;
export default businessTypeSlice.reducer;
