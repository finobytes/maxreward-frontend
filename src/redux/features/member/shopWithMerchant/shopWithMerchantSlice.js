import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactionAmount: "",
  transactionAmountValue: 0,
  redeemAmount: "",
  redeemAmountValue: 0,
  redeemPoints: 0,
  balanceToPay: 0,
  cashRedeemAmount: 0,
  rmPoints: 1,
  settings: null,
  merchant: null,
  merchantId: null,
  merchantSelectionType: "merchant_name",
  paymentMethod: "manual",
  // verified: false,
};

const normalizeNumber = (value) => {
  const num = parseFloat(value);
  if (Number.isNaN(num) || num < 0) return 0;
  return num;
};

const calculateBreakdown = (state) => {
  const transaction = normalizeNumber(state.transactionAmount);
  let redeem = normalizeNumber(state.redeemAmount);

  if (transaction === 0) {
    redeem = 0;
  } else if (redeem > transaction) {
    redeem = transaction;
  }

  const rmPoints =
    Number(state.settings?.rm_points ?? state.rmPoints ?? 1) || 1;

  state.rmPoints = rmPoints;
  state.transactionAmountValue = transaction;
  state.redeemAmountValue = redeem;
  state.redeemPoints = redeem * rmPoints;
  state.balanceToPay = Math.max(transaction - redeem, 0);
  state.cashRedeemAmount = Math.max(transaction - redeem, 0);
};

const shopWithMerchantSlice = createSlice({
  name: "shopWithMerchant",
  initialState,
  reducers: {
    setTransactionAmount: (state, action) => {
      state.transactionAmount = action.payload ?? "";
      // state.verified = false;
      calculateBreakdown(state);
    },

    setRedeemAmount: (state, action) => {
      state.redeemAmount = action.payload ?? "";
      // state.verified = false;
      calculateBreakdown(state);
    },

    setMerchant: (state, action) => {
      const merchant = action.payload || null;
      state.merchant = merchant;
      state.merchantId = merchant?.id ?? null;
      // state.verified = false;
    },

    setMerchantSelectionType: (state, action) => {
      state.merchantSelectionType = action.payload || "merchant_name";
    },

    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload || "manual";
    },

    setSettings: (state, action) => {
      const settings = action.payload || null;
      state.settings = settings;
      calculateBreakdown(state);
    },

    // setVerified: (state, action) => {
    //   state.verified = Boolean(action.payload);
    // },

    resetShopWithMerchant: () => ({ ...initialState }),
  },
});

export const {
  setTransactionAmount,
  setRedeemAmount,
  setMerchant,
  setMerchantSelectionType,
  setPaymentMethod,
  setSettings,
  // setVerified,
  resetShopWithMerchant,
} = shopWithMerchantSlice.actions;

export default shopWithMerchantSlice.reducer;
