import { baseApi } from "../../../api/baseApi";

export const memberOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: ({ page = 1, per_page = 20, status, ...rest } = {}) => ({
        url: "/member/orders",
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
          "MemberOrder",
          ...orders
            .map((order) => order?.order_number)
            .filter(Boolean)
            .map((orderNumber) => ({ type: "MemberOrder", id: orderNumber })),
        ];
      },
    }),
    getMemberOrderDetails: builder.query({
      query: (orderNumber) => `/member/orders/${orderNumber}`,
      providesTags: (result, error, id) => [{ type: "MemberOrder", id }],
    }),
    cancelMemberOrder: builder.mutation({
      query: ({ orderNumber, ...body }) => ({
        url: `/member/orders/${orderNumber}/cancel`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { orderNumber }) => [
        "MemberOrder",
        { type: "MemberOrder", id: orderNumber },
      ],
    }),
    requestReturnOrder: builder.mutation({
      query: ({ orderNumber, ...body }) => ({
        url: `/member/orders/${orderNumber}/return`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { orderNumber }) => [
        "MemberOrder",
        { type: "MemberOrder", id: orderNumber },
      ],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetMemberOrderDetailsQuery,
  useCancelMemberOrderMutation,
  useRequestReturnOrderMutation,
} = memberOrderApi;
