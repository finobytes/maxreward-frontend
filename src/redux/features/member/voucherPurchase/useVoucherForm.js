// src/redux/features/member/voucherPurchase/useVoucherForm.js
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useGetAllDenominationsQuery } from "../../admin/denomination/denominationApi";
import { useGetCurrentSettingsQuery } from "../../admin/settings/settingsApi";
import { useCreateVoucherMutation } from "./voucherApi";
import {
  setDenomination,
  setQuantity,
  setPaymentMethod,
  setManualDocs,
  setSettings,
  setVoucherType,
  calculateTotal,
  resetVoucher,
} from "./voucherFormSlice";

export const useVoucherForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🧠 Correct slice selector
  const state = useSelector((s) => s.voucherForm);

  // Queries
  const { data: denomData, isLoading: denomLoading } =
    useGetAllDenominationsQuery();
  const { data: settingsData, isLoading: settingsLoading } =
    useGetCurrentSettingsQuery();
  const [createVoucher, { isLoading: creating }] = useCreateVoucherMutation();

  // ✅ Load settings safely (no dispatch during render)
  useEffect(() => {
    if (settingsData && !state.settings) {
      dispatch(setSettings(settingsData.setting_attribute));
      dispatch(calculateTotal());
    }
  }, [settingsData, state.settings, dispatch]);

  // Derived
  const denominations = denomData?.data?.denominations || [];

  // ✅ Create Voucher with FormData
  const handleCreateVoucher = async () => {
    try {
      const formData = new FormData();
      formData.append("member_id", state.memberId || 1);
      formData.append("voucher_type", state.voucherType);
      formData.append("denomination_id", state.denominationId);
      formData.append("quantity", state.quantity);
      formData.append("payment_method", state.paymentMethod.toLowerCase());
      formData.append("total_amount", state.totalAmount);

      if (state.paymentMethod === "manual" && state.manualPaymentDocs) {
        formData.append("manual_payment_docs", state.manualPaymentDocs);
      }

      const res = await createVoucher(formData).unwrap();

      if (res?.success) {
        toast.success(res.message || "Voucher created successfully!");
        dispatch(resetVoucher());
        navigate("/member/purchase-voucher");
      } else {
        toast.error(res.message || "Failed to create voucher");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return {
    ...state,
    denominations,
    denomLoading,
    settingsLoading,
    creating,
    setDenomination: (denom) => dispatch(setDenomination(denom)),
    setQuantity: (qty) => dispatch(setQuantity(qty)),
    setPaymentMethod: (m) => dispatch(setPaymentMethod(m)),
    setManualDocs: (f) => dispatch(setManualDocs(f)),
    setVoucherType: (v) => dispatch(setVoucherType(v)),
    handleCreateVoucher,
  };
};
