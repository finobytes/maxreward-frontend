import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSearch,
  setCurrentPage,
  setPerPage,
  setStatus,
  setSortBy,
  setSortOrder,
  resetFilters,
} from "./merchantStaffSlice";
import { useGetAllStaffsQuery } from "./merchantStaffApi";
import { useVerifyMeQuery } from "../../auth/authApi";

export const useMerchantStaff = () => {
  const dispatch = useDispatch();
  const { search, status, currentPage, perPage, sortBy, sortOrder } =
    useSelector((state) => state.merchantStaff);

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "member"; // admin | merchant | member
  const { data: verifyData, isLoading: verifying } = useVerifyMeQuery(role);

  console.log("verifyData", verifyData)

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const merchantId =
    verifyData?.user?.merchant_id || // corporate member
    verifyData?.user?.merchant?.corporate_member_id || // direct corporate member id
    verifyData?.user?.member?.id || // member id
    verifyData?.user?.data?.id || // fallback
    verifyData?.user?.id; // fallback


    console.log("merchantId", merchantId);

  // Debounce search by 600ms
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearch(debouncedSearch));
    }, 600);
    return () => clearTimeout(handler);
  }, [debouncedSearch, dispatch]);

  const { data, isLoading, isFetching, refetch } = useGetAllStaffsQuery(
    merchantId,
    { skip: !merchantId }
  );
  console.log("merchantId", merchantId);
  console.log("data merchant", data);
  // Filter & Sort locally
  const filteredStaffs = useMemo(() => {
    if (!data?.staffs) return [];

    let staffs = [...data.staffs];

    if (search) {
      staffs = staffs.filter(
        (s) =>
          s.name?.toLowerCase().includes(search.toLowerCase()) ||
          s.email?.toLowerCase().includes(search.toLowerCase()) ||
          s.phone?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      staffs = staffs.filter((s) => s.status === status);
    }

    // Simple sorting
    staffs.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === "created_at") {
        return sortOrder === "asc"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

    return staffs;
  }, [data, search, status, sortBy, sortOrder]);

  // Handle pagination locally
  const paginatedStaffs = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredStaffs.slice(start, start + perPage);
  }, [filteredStaffs, currentPage, perPage]);

  const totalPages = Math.ceil(filteredStaffs.length / perPage);

  return {
    staffs: paginatedStaffs,
    pagination: {
      currentPage,
      totalPages,
      total: filteredStaffs.length,
      perPage,
    },
    isLoading,
    isFetching,
    refetch,
    filters: { search, status, currentPage, perPage, sortBy, sortOrder },
    actions: {
      setDebouncedSearch,
      setStatus: (val) => dispatch(setStatus(val)),
      setSortBy: (val) => dispatch(setSortBy(val)),
      setSortOrder: (val) => dispatch(setSortOrder(val)),
      setCurrentPage: (val) => dispatch(setCurrentPage(val)),
      setPerPage: (val) => dispatch(setPerPage(val)),
      resetFilters: () => dispatch(resetFilters()),
    },
    debouncedSearch,
  };
};
