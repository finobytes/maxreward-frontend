import { baseApi } from "../../../api/baseApi";

export const shippingRateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippingRates: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        zone_id = "",
        method_id = "",
        is_active = "",
        sort_by = "",
        sort_order = "",
        all = "",
      } = {}) => {
        let queryString = `/merchant/shipping-rates?per_page=${per_page}&page=${page}`;
        if (zone_id) queryString += `&zone_id=${encodeURIComponent(zone_id)}`;
        if (method_id)
          queryString += `&method_id=${encodeURIComponent(method_id)}`;
        if (is_active !== "" && is_active !== null && is_active !== undefined) {
          queryString += `&is_active=${is_active}`;
        }
        if (sort_by) queryString += `&sort_by=${encodeURIComponent(sort_by)}`;
        if (sort_order)
          queryString += `&sort_order=${encodeURIComponent(sort_order)}`;
        if (all) queryString += `&all=${encodeURIComponent(all)}`;
        return queryString;
      },
    }),

    getShippingRateOptions: builder.query({
      query: () => "/merchant/shipping-rates/options",
    }),

    getShippingRate: builder.query({
      query: (id) => `/merchant/shipping-rates/${id}`,
    }),

    createShippingRate: builder.mutation({
      query: (data) => ({
        url: "/merchant/shipping-rates",
        method: "POST",
        body: data,
      }),
    }),

    updateShippingRate: builder.mutation({
      query: ({ id, data }) => ({
        url: `/merchant/shipping-rates/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteShippingRate: builder.mutation({
      query: (id) => ({
        url: `/merchant/shipping-rates/${id}`,
        method: "DELETE",
      }),
    }),

    toggleShippingRateStatus: builder.mutation({
      query: (id) => ({
        url: `/merchant/shipping-rates/${id}/toggle-status`,
        method: "PATCH",
      }),
    }),

    bulkCreateShippingRates: builder.mutation({
      query: (data) => ({
        url: "/merchant/shipping-rates/bulk-create",
        method: "POST",
        body: data,
      }),
    }),

    bulkDeleteShippingRates: builder.mutation({
      query: (data) => ({
        url: "/merchant/shipping-rates/bulk-delete",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetShippingRatesQuery,
  useGetShippingRateOptionsQuery,
  useGetShippingRateQuery,
  useCreateShippingRateMutation,
  useUpdateShippingRateMutation,
  useDeleteShippingRateMutation,
  useToggleShippingRateStatusMutation,
  useBulkCreateShippingRatesMutation,
  useBulkDeleteShippingRatesMutation,
} = shippingRateApi;
