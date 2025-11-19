import { baseApi } from "../../../api/baseApi";

export const cpTransactionMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCpTransaction: builder.query({
      query: ({ memberId, page = 1, perPage } = {}) => {
        return {
          url: `/member/cp-transactions`,
          params: {
            page,
            per_page: perPage,
          },
        };
      },
      keepUnusedDataFor: 0,
    }),
    getCpTransactionDetails: builder.query({
      query: (transactionId) => ({
        url: `/transactions/${transactionId}`,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetCpTransactionQuery, useGetCpTransactionDetailsQuery } =
  cpTransactionMemberApi;
