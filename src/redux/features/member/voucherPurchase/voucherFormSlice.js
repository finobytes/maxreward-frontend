// src/redux/features/member/voucherPurchase/voucherFormSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  denominationId: null,
  denominationValue: 0,
  quantity: 1,
  paymentMethod: "manual",
  voucherType: "max",
  manualPaymentDocs: "",
  totalAmount: 0,
  memberId: null,
  settings: null,
};

const voucherFormSlice = createSlice({
  name: "voucherForm",
  initialState,
  reducers: {
    setVoucherData: (state, action) => {
      Object.assign(state, action.payload);
    },

    setDenomination: (state, action) => {
      state.denominationId = action.payload.id;
      state.denominationValue = Number(action.payload.value);
      voucherFormSlice.caseReducers.calculateTotal(state);
    },

    setQuantity: (state, action) => {
      state.quantity = action.payload;
      voucherFormSlice.caseReducers.calculateTotal(state);
    },

    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },

    setManualDocs: (state, action) => {
      state.manualPaymentDocs = action.payload;
    },

    setSettings: (state, action) => {
      state.settings = action.payload;
      voucherFormSlice.caseReducers.calculateTotal(state);
    },

    setVoucherType: (state, action) => {
      state.voucherType = action.payload;
    },

    setMemberId: (state, action) => {
      state.memberId = action.payload;
    },

    calculateTotal: (state) => {
      if (!state.settings) return;
      const rmPoints = Number(state.settings.rm_points || 1);
      const denom = Number(state.denominationValue || 0);
      const qty = Number(state.quantity || 1);
      state.totalAmount = denom * rmPoints * qty;
    },

    resetVoucher: () => initialState,
  },
});

export const {
  setVoucherData,
  setDenomination,
  setQuantity,
  setPaymentMethod,
  setManualDocs,
  setSettings,
  setVoucherType,
  setMemberId,
  calculateTotal,
  resetVoucher,
} = voucherFormSlice.actions;

export default voucherFormSlice.reducer;
