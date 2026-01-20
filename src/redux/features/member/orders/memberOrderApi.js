import { baseApi } from "../../../api/baseApi";

export const memberOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: (params) => ({
        url: "/member/orders",
        method: "GET",
        params,
      }),
      providesTags: ["MemberOrder"],
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
      invalidatesTags: ["MemberOrder"],
    }),
    requestReturnOrder: builder.mutation({
      query: ({ orderNumber, ...body }) => ({
        url: `/member/orders/${orderNumber}/return`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["MemberOrder"],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetMemberOrderDetailsQuery,
  useCancelMemberOrderMutation,
  useRequestReturnOrderMutation,
} = memberOrderApi;
