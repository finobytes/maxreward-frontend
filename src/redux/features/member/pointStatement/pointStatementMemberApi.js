import { baseApi } from "../../../api/baseApi";

export const pointStatementMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPointStatement: builder.query({
      query: ({ memberId, page = 1, perPage } = {}) => {
        return {
          url: `/transactions/${memberId}/member`,
          params: {
            page,
            per_page: perPage,
          },
        };
      },
      keepUnusedDataFor: 0,
    }),
    getTransactionDetails: builder.query({
      query: (transactionId) => ({
        url: `/transactions/${transactionId}`,
      }),
      keepUnusedDataFor: 0,
    }),
    getAvailableTransactions: builder.query({
      query: ({ memberId, page = 1, perPage = 20 } = {}) => ({
        url: `/transactions/${memberId}/member/available/transactions`,
        params: {
          page,
          per_page: perPage,
        },
      }),
      keepUnusedDataFor: 0,
    }),
    getReferTransactions: builder.query({
      query: ({ memberId, page = 1, perPage = 20 } = {}) => ({
        url: `/transactions/${memberId}/member/refer/transactions`,
        params: {
          page,
          per_page: perPage,
        },
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetPointStatementQuery,
  useGetTransactionDetailsQuery,
  useGetAvailableTransactionsQuery,
  useGetReferTransactionsQuery,
} = pointStatementMemberApi;
