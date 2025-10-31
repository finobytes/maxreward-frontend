import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setPage,
  setPerPage,
  setStatus,
  setBusinessType,
  setSearch,
} from "./merchantManagementSlice";
import { useGetMerchantsQuery } from "./merchantManagementApi";

export const useMerchantManagement = () => {
  const dispatch = useDispatch();
  const { page, perPage, status, businessType, search } = useSelector(
    (state) => state.merchantManagement
  );

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearch(debouncedSearch));
    }, 600);
    return () => clearTimeout(handler);
  }, [debouncedSearch, dispatch]);

  // Sync redux search → local input
  useEffect(() => {
    setDebouncedSearch(search);
  }, [search]);

  const { data, isFetching, isLoading, isError, refetch } =
    useGetMerchantsQuery({
      page,
      per_page: perPage,
      status,
      business_type: businessType,
      search,
    });

  const merchants = data?.merchants ?? [];
  const pagination = data?.pagination ?? {};

  const clearFilters = () => {
    dispatch(setStatus(""));
    dispatch(setBusinessType(""));
    dispatch(setSearch(""));
    dispatch(setPage(1));
    dispatch(setPerPage(10));
    refetch();
  };

  return {
    merchants,
    pagination,
    isFetching,
    isLoading,
    isError,
    refetch,
    filters: { page, perPage, status, businessType, search },
    debouncedSearch,
    actions: {
      setPage: (val) => dispatch(setPage(val)),
      setPerPage: (val) => dispatch(setPerPage(val)),
      setStatus: (val) => dispatch(setStatus(val)),
      setBusinessType: (val) => dispatch(setBusinessType(val)),
      setDebouncedSearch,
      clearFilters,
    },
  };
};
