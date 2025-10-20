import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  setSearch,
  setStatus,
  setCurrentPage,
  resetFilters,
} from "./adminStaffSlice";
import { useGetAdminStaffsQuery } from "./adminStaffApi";

export const useAdminStaff = () => {
  const dispatch = useDispatch();
  const { filters, pagination } = useSelector((state) => state.adminStaff);
  const { search, status } = filters;
  const { currentPage } = pagination;

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearch(debouncedSearch));
    }, 600);
    return () => clearTimeout(handler);
  }, [debouncedSearch, dispatch]);

  const { data, isLoading, isFetching, error } = useGetAdminStaffsQuery(
    {
      page: currentPage,
      search,
      status,
    },
    { keepPreviousData: true }
  );

  return {
    staffs: data?.staffs || [],
    pagination: data?.pagination || { currentPage: 1, totalPages: 1 },
    isLoading,
    isFetching,
    error,
    filters: { search, status, debouncedSearch },
    actions: {
      setSearch: setDebouncedSearch,
      setStatus: (val) => dispatch(setStatus(val)),
      setCurrentPage: (page) => dispatch(setCurrentPage(page)),
      resetFilters: () => dispatch(resetFilters()),
    },
  };
};
