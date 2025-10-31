import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  denominationId: null,
  denominationValue: 0, // e.g. 10, 20, etc.
  quantity: 1,
  paymentMethod: "manual", // or "online"
  voucherType: "max", // e.g. max, reward, etc.
  manualPaymentDocs: "",
  totalAmount: 0,
  memberId: null,
  settings: null, // rm_points etc.
};

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    setVoucherData: (state, action) => {
      Object.assign(state, action.payload);
    },

    setDenomination: (state, action) => {
      state.denominationId = action.payload.id;
      state.denominationValue = Number(action.payload.value);
      voucherSlice.caseReducers.calculateTotal(state);
    },

    setQuantity: (state, action) => {
      state.quantity = action.payload;
      voucherSlice.caseReducers.calculateTotal(state);
    },

    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },

    setManualDocs: (state, action) => {
      state.manualPaymentDocs = action.payload;
    },

    setSettings: (state, action) => {
      state.settings = action.payload;
      voucherSlice.caseReducers.calculateTotal(state);
    },

    setVoucherType: (state, action) => {
      state.voucherType = action.payload;
    },

    setMemberId: (state, action) => {
      state.memberId = action.payload;
    },

    // 🧮 Derived calculation
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
} = voucherSlice.actions;

export default voucherSlice.reducer;
