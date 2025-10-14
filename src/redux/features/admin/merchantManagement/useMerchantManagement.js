import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetMerchantsQuery } from "./merchantManagementApi";
import { setPagination, setFilters } from "./merchantManagementSlice";

export const useMerchantManagement = () => {
  const dispatch = useDispatch();
  const { pagination, filters } = useSelector(
    (state) => state.merchantManagement
  );

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Debounce search input (600ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setFilters({ search: debouncedSearch }));
    }, 600);
    return () => clearTimeout(handler);
  }, [debouncedSearch, dispatch]);

  const queryParams = {
    page: pagination.page,
    per_page: pagination.per_page,
    status: filters.status,
    business_type: filters.business_type,
    search: filters.search,
  };

  const { data, error, isFetching, refetch } =
    useGetMerchantsQuery(queryParams);

  const handlePageChange = (page) => {
    dispatch(setPagination({ page }));
  };

  const handlePerPageChange = (per_page) => {
    dispatch(setPagination({ per_page, page: 1 }));
  };

  const handleFilterChange = (filter) => {
    dispatch(setFilters(filter));
  };

  return {
    data,
    error,
    isFetching,
    refetch,
    pagination,
    filters,
    debouncedSearch,
    setDebouncedSearch,
    handlePageChange,
    handlePerPageChange,
    handleFilterChange,
  };
};
