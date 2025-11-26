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
    getMemberCommunityPointDetails: builder.mutation({
      query: (memberId) => ({
        url: `/admin/community-points/member/${memberId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAdminCommunityPointQuery,
  useGetMemberCommunityPointDetailsMutation
} = communityPointAdminApi;
