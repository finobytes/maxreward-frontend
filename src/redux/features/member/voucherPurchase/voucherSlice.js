import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  page: 1,
  member_id: "",
  payment_method: "",
  voucher_type: "",
  status: "all",
};

const voucherSlice = createSlice({
  name: "voucherManagement",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setMemberId(state, action) {
      state.member_id = action.payload;
      state.page = 1;
    },
    setPaymentMethod(state, action) {
      state.payment_method = action.payload;
      state.page = 1;
    },
    setVoucherType(state, action) {
      state.voucher_type = action.payload;
      state.page = 1;
    },
    setStatus(state, action) {
      state.status = action.payload;
      state.page = 1;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setSearch,
  setPage,
  setMemberId,
  setPaymentMethod,
  setVoucherType,
  setStatus,
  resetFilters,
} = voucherSlice.actions;

export default voucherSlice.reducer;
