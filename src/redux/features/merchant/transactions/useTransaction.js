import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useVerifyMeQuery } from "../../auth/authApi";
import {
  setSearch,
  setPage,
  setPerPage,
  setStatus,
  resetFilters,
} from "./transactionsSlice";
import {
  useApprovePurchaseMutation,
  useGetPendingPurchasesQuery,
  useGetPurchasesQuery,
} from "./transactionsApi";

const pickMerchantId = (profile) =>
  profile?.merchant_id ||
  profile?.merchantId ||
  profile?.merchant?.id ||
  profile?.data?.merchant_id ||
  profile?.data?.merchant?.id ||
  profile?.id ||
  profile?.data?.id ||
  null;

export const useTransactions = (view = "pending") => {
  const dispatch = useDispatch();
  const filters =
    useSelector((state) => state.transactions.filters[view]) || {};

  const [searchValue, setSearchValue] = useState(filters.search ?? "");

  useEffect(() => {
    setSearchValue(filters.search ?? "");
  }, [filters.search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const incoming = searchValue ?? "";
      if ((filters.search ?? "") !== incoming) {
        dispatch(setSearch({ view, value: incoming }));
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [dispatch, filters.search, searchValue, view]);

  const {
    data: merchantProfile,
    isLoading: merchantLoading,
    isFetching: merchantFetching,
  } = useVerifyMeQuery("merchant");
  const merchantId = useMemo(
    () => pickMerchantId(merchantProfile),
    [merchantProfile]
  );

  console.log("merchant id", merchantId);
  const queryArgs = {
    merchantId,
    page: filters.page ?? 1,
    perPage: filters.perPage ?? 10,
    search: filters.search ?? "",
    status: filters.status ?? "all",
  };

  const pendingQuery = useGetPendingPurchasesQuery(queryArgs, {
    skip: view !== "pending" || !merchantId,
  });

  const purchasesQuery = useGetPurchasesQuery(queryArgs, {
    skip: view !== "all" || !merchantId,
  });

  const {
    data,
    isLoading: listLoading,
    isFetching,
    error,
    refetch,
  } = view === "pending" ? pendingQuery : purchasesQuery;

  const transactions = data?.rows ?? [];
  const meta = data?.meta ?? {
    currentPage: filters.page ?? 1,
    lastPage: 1,
    perPage: filters.perPage ?? 10,
    total: 0,
  };

  const [approvePurchaseMutation, { isLoading: approveLoading }] =
    useApprovePurchaseMutation();
  const [approvingId, setApprovingId] = useState(null);

  const approvePurchase = useCallback(
    async (purchaseId) => {
      if (!merchantId) {
        toast.error("Merchant context is missing.");
        return false;
      }

      try {
        setApprovingId(purchaseId);
        const res = await approvePurchaseMutation({
          merchantId,
          purchaseId,
        }).unwrap();
        toast.success(res?.message || "Purchase approved successfully.");
        refetch();
        return true;
      } catch (err) {
        toast.error(
          err?.data?.message || "Failed to approve purchase. Please try again."
        );
        return false;
      } finally {
        setApprovingId(null);
      }
    },
    [approvePurchaseMutation, merchantId, refetch]
  );

  const combinedLoading =
    merchantLoading || merchantFetching || listLoading || !merchantId;

  return {
    merchantId,
    transactions,
    meta,
    isLoading: combinedLoading,
    isFetching,
    error,
    searchValue,
    setSearchValue,
    status: filters.status ?? "all",
    setStatus: (value) => dispatch(setStatus({ view, value })),
    page: filters.page ?? 1,
    setPage: (value) => dispatch(setPage({ view, value })),
    perPage: filters.perPage ?? 10,
    setPerPage: (value) => dispatch(setPerPage({ view, value })),
    reset: () => dispatch(resetFilters({ view })),
    refresh: refetch,
    approvePurchase,
    approving: approveLoading,
    approvingId,
  };
};
