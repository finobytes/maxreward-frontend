import { baseApi } from "../../../api/baseApi";

export const merchantOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- Orders ---
    getMerchantOrders: builder.query({
      query: (params = {}) => ({
        url: "/merchant/orders",
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        const orders = result?.data?.data || [];
        return [
          { type: "MerchantOrder", id: "LIST" },
          ...orders.map((order) => ({
            type: "MerchantOrder",
            id: order?.order_number,
          })),
        ];
      },
    }),
    getMerchantOrderDetails: builder.query({
      query: (orderNumber) => `/merchant/orders/${orderNumber}`,
      providesTags: (result, error, orderNumber) => [
        { type: "MerchantOrder", id: orderNumber },
      ],
    }),
    shipOrder: builder.mutation({
      query: ({ orderNumber, tracking_number }) => ({
        url: `/merchant/orders/${orderNumber}/ship`,
        method: "POST",
        body: { tracking_number },
      }),
      invalidatesTags: (result, error, { orderNumber }) => [
        { type: "MerchantOrder", id: "LIST" },
        { type: "MerchantOrder", id: orderNumber },
      ],
    }),
    cancelOrder: builder.mutation({
      query: ({ orderNumber, reason_type, reason_details }) => ({
        url: `/merchant/orders/${orderNumber}/cancel`,
        method: "POST",
        body: { reason_type, reason_details },
      }),
      invalidatesTags: (result, error, { orderNumber }) => [
        { type: "MerchantOrder", id: "LIST" },
        { type: "MerchantOrder", id: orderNumber },
      ],
    }),
    getEligibleOrders: builder.query({
      query: () => "/merchant/orders/auto-complete/eligible",
      providesTags: ["EligibleOrders"],
    }),
    autoCompleteOrders: builder.mutation({
      query: () => ({
        url: "/merchant/orders/auto-complete",
        method: "POST",
      }),
      invalidatesTags: [
        "EligibleOrders",
        { type: "MerchantOrder", id: "LIST" },
      ],
    }),

    // --- Exchanges ---
    getMerchantExchanges: builder.query({
      query: (params = {}) => ({
        url: "/merchant/exchanges",
        method: "GET",
        params,
      }),
      providesTags: ["MerchantExchange"],
    }),
    getExchangeDetails: builder.query({
      query: (id) => `/merchant/exchanges/${id}`,
      providesTags: (result, error, id) => [{ type: "MerchantExchange", id }],
    }),
    createExchange: builder.mutation({
      query: (body) => ({
        url: "/merchant/exchanges",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MerchantExchange"],
    }),
    approveExchange: builder.mutation({
      query: (id) => ({
        url: `/merchant/exchanges/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        "MerchantExchange",
        { type: "MerchantExchange", id },
      ],
    }),
    rejectExchange: builder.mutation({
      query: ({ id, rejection_reason }) => ({
        url: `/merchant/exchanges/${id}/reject`,
        method: "POST",
        body: { rejection_reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        "MerchantExchange",
        { type: "MerchantExchange", id },
      ],
    }),
    completeExchange: builder.mutation({
      query: (id) => ({
        url: `/merchant/exchanges/${id}/complete`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        "MerchantExchange",
        { type: "MerchantExchange", id },
      ],
    }),
    getAvailableVariations: builder.query({
      query: (orderItemId) =>
        `/merchant/exchanges/available-variations/${orderItemId}`,
    }),
    getExchangeStatistics: builder.query({
      query: () => "/merchant/exchanges/statistics",
      providesTags: ["MerchantExchangeStats"],
    }),
  }),
});

export const {
  useGetMerchantOrdersQuery,
  useGetMerchantOrderDetailsQuery,
  useShipOrderMutation,
  useCancelOrderMutation,
  useGetEligibleOrdersQuery,
  useAutoCompleteOrdersMutation,
  useGetMerchantExchangesQuery,
  useGetExchangeDetailsQuery,
  useCreateExchangeMutation,
  useApproveExchangeMutation,
  useRejectExchangeMutation,
  useCompleteExchangeMutation,
  useGetAvailableVariationsQuery,
  useLazyGetAvailableVariationsQuery,
  useGetExchangeStatisticsQuery,
} = merchantOrderApi;
