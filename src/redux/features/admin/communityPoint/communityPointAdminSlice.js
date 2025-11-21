import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  perPage: 20,
};

const communityPointAdminSlice = createSlice({
  name: "communityPointAdmin",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    resetCommunityPointFilters: () => initialState,
  },
});

export const { setPage, setPerPage, resetCommunityPointFilters } =
  communityPointAdminSlice.actions;

export default communityPointAdminSlice.reducer;
