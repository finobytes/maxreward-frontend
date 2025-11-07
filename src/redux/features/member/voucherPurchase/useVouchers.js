// useVouchers.js
import { useSelector } from "react-redux";
import { useGetVouchersQuery } from "./voucherApi";

export const useVouchers = () => {
  const { search, page, member_id, payment_method, voucher_type, status } =
    useSelector((state) => state.voucherManagement);

  const params = {
    search: search || undefined,
    page,
    member_id: member_id || undefined,
    payment_method: payment_method || undefined,
    voucher_type: voucher_type || undefined,
    status: status !== "all" ? status : undefined,
  };

  const { data, isLoading, isFetching, isError, refetch } = useGetVouchersQuery(
    params,
    {
      refetchOnMountOrArgChange: true,
      keepPreviousData: true,
    }
  );

  const vouchersContainer = data;
  console.log("Vouchers Container ", vouchersContainer);
  const vouchers = vouchersContainer?.vouchers;
  const meta = {
    current_page: vouchersContainer?.meta?.current_page ?? 1,
    last_page: vouchersContainer?.meta?.last_page ?? 1,
  };

  return { vouchers, meta, isLoading, isFetching, isError, refetch };
};
