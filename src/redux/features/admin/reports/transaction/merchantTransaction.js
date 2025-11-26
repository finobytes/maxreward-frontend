import { baseApi } from "../../../../api/baseApi";

export const merchantTransactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMerchantTransactions: builder.query({
      query: ({ page = 1 }) =>
        `/admin/get-all-merchants-purchases-data?page=${page}`,
      transformResponse: (response) => {
        const d = response?.data || {};
        return {
          transactions: d.data || [],
          meta: {
            current_page: d.current_page,
            last_page: d.last_page,
            total: d.total,
            per_page: d.per_page,
          },
        };
      },

      providesTags: ["Transactions"],
    }),
  }),
});

export const { useGetMerchantTransactionsQuery } = merchantTransactionApi;
