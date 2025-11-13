import { createSlice } from "@reduxjs/toolkit";

const createFilters = () => ({
  pending: {
    search: "",
    page: 1,
    perPage: 10,
  },
  all: {
    search: "",
    status: "all",
    page: 1,
    perPage: 10,
  },
});

const initialState = {
  filters: createFilters(),
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      const { view = "pending", value = "" } = action.payload || {};
      if (!state.filters[view]) return;
      state.filters[view].search = value;
      state.filters[view].page = 1;
    },
    setPage: (state, action) => {
      const { view = "pending", value = 1 } = action.payload || {};
      if (!state.filters[view]) return;
      const page = Math.max(1, Number(value) || 1);
      state.filters[view].page = page;
    },
    setPerPage: (state, action) => {
      const { view = "pending", value = 10 } = action.payload || {};
      if (!state.filters[view]) return;
      const perPage = Math.max(1, Number(value) || state.filters[view].perPage);
      state.filters[view].perPage = perPage;
      state.filters[view].page = 1;
    },
    setStatus: (state, action) => {
      const { view = "all", value = "all" } = action.payload || {};
      if (!state.filters[view] || !("status" in state.filters[view])) return;
      state.filters[view].status = value;
      state.filters[view].page = 1;
    },
    resetFilters: (state, action) => {
      const view = action.payload?.view;
      if (view && state.filters[view]) {
        const defaults = createFilters();
        state.filters[view] = { ...defaults[view] };
      } else {
        state.filters = createFilters();
      }
    },
  },
});

export const { setSearch, setPage, setPerPage, setStatus, resetFilters } =
  transactionsSlice.actions;

export default transactionsSlice.reducer;
