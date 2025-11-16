import { baseApi } from "../../../api/baseApi";

const normalizePaginatedResponse = (response) => {
  const payload = response?.data ?? response ?? {};
  const rows = payload?.data ?? [];

  return {
    rows,
    meta: {
      currentPage: payload?.current_page ?? 1,
      lastPage: payload?.last_page ?? 1,
      perPage: payload?.per_page ?? rows.length ?? 0,
      total: payload?.total ?? rows.length ?? 0,
    },
  };
};

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingPurchases: builder.query({
      query: ({ merchantId, page = 1, perPage = 10, search }) => ({
        url: `/merchants/${merchantId}/pending/purchases`,
        params: {
          page,
          per_page: perPage,
          search: search || undefined,
        },
      }),
      transformResponse: normalizePaginatedResponse,
      providesTags: (result) =>
        result?.rows?.length
          ? [
              ...result.rows.map(({ id }) => ({
                type: "MerchantTransactions",
                id,
              })),
              { type: "MerchantTransactions", id: "PENDING" },
            ]
          : [{ type: "MerchantTransactions", id: "PENDING" }],
    }),

    getPurchases: builder.query({
      query: ({ merchantId, page = 1, perPage = 10, search, status }) => ({
        url: `/merchants/${merchantId}/purchases`,
        params: {
          page,
          per_page: perPage,
          search: search || undefined,
          status: status && status !== "all" ? status : undefined,
        },
      }),
      transformResponse: normalizePaginatedResponse,
      providesTags: (result) =>
        result?.rows?.length
          ? [
              ...result.rows.map(({ id }) => ({
                type: "MerchantTransactions",
                id,
              })),
              { type: "MerchantTransactions", id: "ALL" },
            ]
          : [{ type: "MerchantTransactions", id: "ALL" }],
    }),

    approvePurchase: builder.mutation({
      query: ({ merchantId, purchaseId }) => ({
        url: `/merchants/${purchaseId}/approve/purchase`,
        method: "POST",
        body: {
          purchase_id: purchaseId,
        },
      }),
      invalidatesTags: [
        { type: "MerchantTransactions", id: "PENDING" },
        { type: "MerchantTransactions", id: "ALL" },
      ],
    }),
    //  Merchant: Reject purchase
    rejectPurchase: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `merchants/rejected/purchase`,
        method: "POST",
        body: {
          purchase_id: id,
          status: status ?? "rejected",
          reason,
        },
      }),
      transformResponse: (response) => {
        return {
          message: response.message,
          data: response.data,
        };
      },
      invalidatesTags: (result, err, { id }) => [
        { type: "MerchantTransactions", id },
        { type: "MerchantTransactions", id: "PENDING" },
        { type: "MerchantTransactions", id: "ALL" },
        { type: "MemberPurchases" },
      ],
    }),
  }),
});

export const {
  useGetPendingPurchasesQuery,
  useGetPurchasesQuery,
  useApprovePurchaseMutation,
  useRejectPurchaseMutation,
} = transactionsApi;
