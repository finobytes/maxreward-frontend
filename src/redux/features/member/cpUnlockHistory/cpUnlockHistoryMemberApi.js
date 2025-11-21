import { baseApi } from "../../../api/baseApi";

export const cpUnlockHistoryMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMemberCpUnlockHistory: builder.query({
      query: ({ memberId, page = 1, perPage } = {}) => {
        return {
          url: `/member/unlock-history`,
          params: {
            page,
            per_page: perPage,
          },
        };
      },
      keepUnusedDataFor: 0,
    }),
    getMemberCpUnlockHistoryDetails: builder.query({
      query: (historyId) => ({
        url: `/unlock-history/${historyId}`,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetMemberCpUnlockHistoryQuery, useGetMemberCpUnlockHistoryDetailsQuery } =
  cpUnlockHistoryMemberApi;
