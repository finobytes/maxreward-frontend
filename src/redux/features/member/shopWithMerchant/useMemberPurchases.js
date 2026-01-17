import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useVerifyMeQuery } from "../../auth/authApi";
import {
  setMemberId,
  setPage as setPurchasePage,
} from "./purchaseManagementSlice";
import { useGetMemberPurchasesQuery } from "./shopWihtMerchantApi";

export const useMemberPurchases = () => {
  const dispatch = useDispatch();
  const {
    memberId,
    page = 1,
    search = "",
    status = "all",
  } = useSelector((state) => state.purchaseManagement || {});
  const { user, token } = useSelector((state) => state.auth);
  const role = user?.role || "member";

  const { data: verifyData, isLoading: verifyingMember } = useVerifyMeQuery(
    role,
    {
      skip: Boolean(memberId) || !token,
    }
  );

  const resolvedMemberId =
    memberId ||
    verifyData?.user?.member?.id ||
    verifyData?.user?.data?.id ||
    verifyData?.user?.id ||
    user?.id ||
    user?.member_id;

  useEffect(() => {
    if (resolvedMemberId && resolvedMemberId !== memberId) {
      dispatch(setMemberId(resolvedMemberId));
    }
  }, [resolvedMemberId, memberId, dispatch]);

  useEffect(() => {
    if (!page) {
      dispatch(setPurchasePage(1));
    }
  }, [page, dispatch]);

  // === Prepare API params ===
  const params = {
    memberId: resolvedMemberId,
    page: page || 1,
    search: search?.trim() || undefined,
    status: status && status !== "all" ? status : undefined,
  };

  const { data, isLoading, isFetching, isError, refetch } =
    useGetMemberPurchasesQuery(params, {
      skip: !resolvedMemberId,
      refetchOnMountOrArgChange: true,
      keepPreviousData: true,
    });

  return {
    purchases: data?.purchases || [],
    summary: data?.summary || {},
    pagination: data?.pagination || {
      currentPage: page || 1,
      lastPage: 1,
      total: 0,
    },
    isLoading: isLoading || verifyingMember,
    isFetching,
    isError,
    refetch,
  };
};
