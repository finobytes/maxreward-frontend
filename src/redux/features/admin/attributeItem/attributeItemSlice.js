import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  per_page: 10,
  search: "",
  is_active: null,
  attribute_id: "",
};

const attributeItemSlice = createSlice({
  name: "attributeItem",
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
    setAttributeId: (state, action) => {
      state.attribute_id = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.search = "";
      state.is_active = null;
      state.attribute_id = "";
      state.page = 1;
    },
  },
});

export const {
  setPage,
  setPerPage,
  setSearch,
  setIsActive,
  setAttributeId,
  resetFilters,
} = attributeItemSlice.actions;

export default attributeItemSlice.reducer;
