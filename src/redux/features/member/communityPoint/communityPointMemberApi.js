import { baseApi } from "../../../api/baseApi";

export const communityPointMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMemberCommunityPoint: builder.query({
      query: ({ memberId } = {}) => {
        return {
          url: `/member/community-points`,
        };
      },
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetMemberCommunityPointQuery } = communityPointMemberApi;
