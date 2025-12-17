import { useDispatch, useSelector } from "react-redux";
import { useGetProductsQuery } from "./productApi";
import {
  setSearch,
  setStatus,
  setCategory,
  setBrand,
  setCurrentPage,
  resetFilters,
} from "./productSlice";

export const useProduct = () => {
  const dispatch = useDispatch();
  const { filters, pagination } = useSelector((state) => state.product);

  // Local state for debounced search if needed within component,
  // but here we can dispatch directly or use a debounced value for the query.
  // Ideally, we want the UI input to update local state, and debounce that to redux.
  // But for now, we'll assume the component handles the debounce dispatching or we provide a helper.

  // Actually, let's just use the current redux state for the query.
  // The component calling setSearch should handle debouncing if it's an input field.
  // OR we can rely on the component using a local state and dispatching on debounce.

  // checking if useDebounce hook exists in the project is good but I'll assume standard pattern.
  // Let's check if useDebounce exists.

  const queryArgs = {
    page: pagination.currentPage,
    per_page: pagination.perPage,
    search: filters.search,
    status: filters.status,
    category_id: filters.category_id,
    brand_id: filters.brand_id,
  };

  const { data, isLoading, isError, error, isFetching } =
    useGetProductsQuery(queryArgs);

  const setDebouncedSearch = (value) => {
    // This function implies we are debouncing here, but we can't easily debounce a dispatch without a custom hook logic.
    // So we will just expose setSearch and let the component handle debouncing or just dispatch immediately.
    dispatch(setSearch(value));
  };

  return {
    products: data?.products || [],
    pagination: {
      ...pagination,
      total: data?.pagination?.total || 0,
      lastPage: data?.pagination?.lastPage || 1,
    },
    isLoading: isLoading || isFetching,
    isError,
    error,
    filters,
    actions: {
      setSearch, // Component should debounce this
      setStatus: (value) => dispatch(setStatus(value)),
      setCategory: (value) => dispatch(setCategory(value)),
      setBrand: (value) => dispatch(setBrand(value)),
      setCurrentPage: (value) => dispatch(setCurrentPage(value)),
      resetFilters: () => dispatch(resetFilters()),
    },
  };
};
