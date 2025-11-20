import { baseApi } from "../../../api/baseApi";

export const cpUnlockHistoryAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCpUnlockHistory: builder.query({
      query: ({ page = 1, perPage } = {}) => {
        return {
          url: `/admin/unlock-history`,
          params: {
            page,
            per_page: perPage,
          },
        };
      },
      keepUnusedDataFor: 0,
    }),
    getAdminCpUnlockHistoryDetails: builder.query({
      query: (historyId) => ({
        url: `/admin/unlock-history/${historyId}`,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetAdminCpUnlockHistoryQuery, useGetAdminCpUnlockHistoryDetailsQuery } =
  cpUnlockHistoryAdminApi;
