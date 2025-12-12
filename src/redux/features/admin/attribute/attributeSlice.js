import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  per_page: 10,
  search: "",
};

const attributeSlice = createSlice({
  name: "attribute",
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
    resetFilters: (state) => {
      state.search = "";
      state.page = 1;
    },
  },
});

export const { setPage, setPerPage, setSearch, resetFilters } =
  attributeSlice.actions;

export default attributeSlice.reducer;
