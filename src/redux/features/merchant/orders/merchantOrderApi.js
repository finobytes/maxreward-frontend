import { baseApi } from "../../../api/baseApi";

export const merchantOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMerchantOrders: builder.query({
      query: ({ page = 1, per_page = 20, status, ...rest } = {}) => ({
        url: "/merchant/orders",
        method: "GET",
        params: {
          page,
          per_page,
          ...rest,
          ...(status ? { status } : {}),
        },
      }),
      providesTags: (result) => {
        const orders = result?.data?.data || [];
        return [
          "MerchantOrder",
          ...orders
            .map((order) => order?.order_number)
            .filter(Boolean)
            .map((orderNumber) => ({ type: "MerchantOrder", id: orderNumber })),
        ];
      },
    }),
    completeOrder: builder.mutation({
      query: ({ orderNumber, ...body }) => ({
        url: `/merchant/orders/${orderNumber}/complete`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { orderNumber }) => [
        "MerchantOrder",
        { type: "MerchantOrder", id: orderNumber },
      ],
    }),
    acceptReturnOrder: builder.mutation({
      query: ({ orderNumber, ...body }) => ({
        url: `/merchant/orders/${orderNumber}/return`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { orderNumber }) => [
        "MerchantOrder",
        { type: "MerchantOrder", id: orderNumber },
      ],
    }),
  }),
});

export const {
  useGetMerchantOrdersQuery,
  useCompleteOrderMutation,
  useAcceptReturnOrderMutation,
} = merchantOrderApi;
