// src/hooks/useVoucher.js
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
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
} from "./voucherSlice";

export const useVoucher = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.voucher);
  const { data: denomData, isLoading: denomLoading } =
    useGetAllDenominationsQuery();
  const { data: settingsData, isLoading: settingsLoading } =
    useGetCurrentSettingsQuery();
  const [createVoucher, { isLoading: creating }] = useCreateVoucherMutation();

  // Load settings when available
  if (settingsData && !state.settings) {
    dispatch(setSettings(settingsData.setting_attribute));
    dispatch(calculateTotal());
  }

  const denominations = denomData?.data?.denominations || [];

  const handleCreateVoucher = async () => {
    try {
      const body = {
        member_id: state.memberId || 1, // ideally from auth
        voucher_type: state.voucherType,
        denomination_id: state.denominationId,
        quantity: state.quantity,
        payment_method: state.paymentMethod.toLowerCase(),
        total_amount: state.totalAmount,
        manual_payment_docs: state.manualPaymentDocs || "",
      };

      const res = await createVoucher(body).unwrap();
      if (res?.success) {
        toast.success(res.message || "Voucher created successfully!");
        dispatch(resetVoucher());
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
