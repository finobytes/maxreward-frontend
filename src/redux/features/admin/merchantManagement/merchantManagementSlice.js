import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  perPage: 10,
  status: "",
  businessType: "",
  search: "",
};

const merchantManagementSlice = createSlice({
  name: "merchantManagement",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
      state.page = 1; // reset page on filter change
    },
    setBusinessType: (state, action) => {
      state.businessType = action.payload;
      state.page = 1;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.status = "";
      state.businessType = "";
      state.search = "";
      state.page = 1;
    },
  },
});

export const {
  setPage,
  setPerPage,
  setStatus,
  setBusinessType,
  setSearch,
  resetFilters,
} = merchantManagementSlice.actions;

export default merchantManagementSlice.reducer;
