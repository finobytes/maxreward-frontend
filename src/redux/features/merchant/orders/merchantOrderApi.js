import { baseApi } from "../../../api/baseApi";

export const merchantOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMerchantOrders: builder.query({
      query: (params) => ({
        url: "/merchant/orders",
        method: "GET",
        params,
      }),
      providesTags: ["MerchantOrder"],
    }),
    completeOrder: builder.mutation({
      query: ({ orderNumber, ...body }) => ({
        url: `/merchant/orders/${orderNumber}/complete`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["MerchantOrder"],
    }),
    acceptReturnOrder: builder.mutation({
      query: ({ orderNumber, ...body }) => ({
        url: `/merchant/orders/${orderNumber}/return`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["MerchantOrder"],
    }),
  }),
});

export const {
  useGetMerchantOrdersQuery,
  useCompleteOrderMutation,
  useAcceptReturnOrderMutation,
} = merchantOrderApi;
