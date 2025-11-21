import { baseApi } from "../../../api/baseApi";

export const communityPointAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCommunityPoint: builder.query({
      query: ({ page = 1, perPage } = {}) => {
        return {
          url: `/admin/community-points`,
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

export const { useGetAdminCommunityPointQuery } = communityPointAdminApi;
