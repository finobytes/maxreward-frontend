import { baseApi } from "../../../api/baseApi";

export const cpTransactionAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCpTransaction: builder.query({
      query: ({ page = 1, perPage } = {}) => {
        return {
          url: `/admin/cp-transactions`,
          params: {
            page,
            per_page: perPage,
          },
        };
      },
      keepUnusedDataFor: 0,
    }),
    getAdminCpTransactionDetails: builder.query({
      query: (transactionId) => ({
        url: `/admin/cp-transactions/${transactionId}`,
      }),
      keepUnusedDataFor: 0,
    }),
    getCPDistributionPool: builder.query({
      query: ({ page = 1, perPage } = {}) => {
        return {
          url: `/admin/get-cp-distribution-pool`,
          params: {
            page,
            per_page: perPage,
          },
        };
      },
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetAdminCpTransactionQuery,
  useGetAdminCpTransactionDetailsQuery,
  useGetCPDistributionPoolQuery,
} = cpTransactionAdminApi;
