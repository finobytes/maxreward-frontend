// src/redux/features/member/voucherPurchase/voucherFormSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDenominations: [],
  paymentMethod: "manual",
  voucherType: "max",
  manualPaymentDocs: null,
  totalAmount: 0,
  totalAmountWithRm: 0,
  totalQuantity: 0,
  rmPoints: 1,
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
      const { id, value, title } = action.payload || {};
      if (!id) return;

      const normalizedValue = Number(value) || 0;
      const exists = state.selectedDenominations.find((d) => d.id === id);

      if (exists) {
        state.selectedDenominations = state.selectedDenominations.filter(
          (d) => d.id !== id
        );
      } else {
        state.selectedDenominations.push({
          id,
          value: normalizedValue,
          quantity: 1,
          title: title || "",
        });
      }

      voucherFormSlice.caseReducers.calculateTotal(state);
    },

    setQuantityForDenom: (state, action) => {
      const { id, quantity } = action.payload || {};
      const qty = Math.max(1, Number(quantity) || 1);
      const denom = state.selectedDenominations.find((d) => d.id === id);
      if (denom) denom.quantity = qty;
      voucherFormSlice.caseReducers.calculateTotal(state);
    },

    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      if (action.payload !== "manual") {
        state.manualPaymentDocs = null;
      }
    },

    setManualDocs: (state, action) => {
      state.manualPaymentDocs = action.payload || null;
    },

    setSettings: (state, action) => {
      const settings = action.payload || null;
      state.settings = settings;
      state.rmPoints = Number(settings?.rm_points ?? 1);
      voucherFormSlice.caseReducers.calculateTotal(state);
    },

    setVoucherType: (state, action) => {
      state.voucherType = action.payload;
    },

    setMemberId: (state, action) => {
      state.memberId = action.payload;
    },

    calculateTotal: (state) => {
      if (!state.selectedDenominations.length) {
        state.totalAmount = 0;
        state.totalAmountWithRm = 0;
        state.totalQuantity = 0;
        return;
      }

      const { subtotal, quantitySum } = state.selectedDenominations.reduce(
        (acc, denom) => {
          const denomValue = Number(denom.value) || 0;
          const qty = Number(denom.quantity) || 0;

          acc.subtotal += denomValue * qty;
          acc.quantitySum += qty;
          return acc;
        },
        { subtotal: 0, quantitySum: 0 }
      );

      const rmPoints = Number(state.settings?.rm_points ?? state.rmPoints ?? 1);

      state.totalAmount = subtotal;
      state.totalAmountWithRm = subtotal * rmPoints;
      state.totalQuantity = quantitySum;
    },

    resetVoucher: () => initialState,
  },
});

export const {
  setVoucherData,
  setDenomination,
  setQuantityForDenom,
  setPaymentMethod,
  setManualDocs,
  setSettings,
  setVoucherType,
  setMemberId,
  calculateTotal,
  resetVoucher,
} = voucherFormSlice.actions;

export default voucherFormSlice.reducer;
