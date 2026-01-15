import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetMerchantProductsQuery,
  useGenerateVariationsMutation,
  useValidateSkuMutation,
} from "./productApi";
import {
  setSearch,
  setStatus,
  setCategory,
  setBrand,
  setType,
  setMerchantId,
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
    type: filters.type,
    merchant_id: filters.merchant_id,
  };

  // Check if we have a merchant_id, if so use the merchant specific endpoint
  // strictly speaking, useProduct is for the merchant dashboard, so we should expected a merchant_id
  // or at least favor the merchant endpoint structure if intended for that role.
  const { data, isLoading, isError, error, isFetching } =
    useGetMerchantProductsQuery(
      { ...queryArgs, merchant_id: filters.merchant_id },
      { skip: !filters.merchant_id } // Skip if no merchant_id is present yet
    );

  const [generateVariations, { isLoading: isGeneratingVariations }] =
    useGenerateVariationsMutation();
  const [validateSku, { isLoading: isValidatingSku }] =
    useValidateSkuMutation();

  const actions = useMemo(
    () => ({
      setSearch,
      setStatus: (value) => dispatch(setStatus(value)),
      setCategory: (value) => dispatch(setCategory(value)),
      setBrand: (value) => dispatch(setBrand(value)),
      setType: (value) => dispatch(setType(value)),
      setMerchantId: (value) => dispatch(setMerchantId(value)),
      setCurrentPage: (value) => dispatch(setCurrentPage(value)),
      resetFilters: () => dispatch(resetFilters()),
      generateVariations,
      validateSku,
    }),
    [dispatch, generateVariations, validateSku]
  );

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
    actions,
    status: {
      isGeneratingVariations,
      isValidatingSku,
    },
  };
};
