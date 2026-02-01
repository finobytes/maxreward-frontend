import { baseApi } from "../../../api/baseApi";

export const referNewMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1️⃣ Refer a new member
    referNewMember: builder.mutation({
      query: (data) => {
        const payload = {
          name: data.name,
          phone: data.phone,
          email: data.email,
          country_id: data.country_id,
          country_code: data.country_code,
        };

        if (data.member_id) {
          payload.member_id = data.member_id;
        }

        return {
          url: "/member/refer-new-member",
          method: "POST",
          body: payload,
        };
      },
    }),

    // 2️⃣ Get referred members
    getReferredMembers: builder.query({
      query: () => ({
        url: "/member/referred-members",
        method: "GET",
      }),
      providesTags: ["Member"],
    }),

    // 2️⃣ Get sponsored members (with backend pagination)
    getSponsoredMembers: builder.query({
      query: ({ page = 1, search = "", status = "" } = {}) => ({
        url: `/member/sponsored-members?page=${page}`,
        method: "GET",
        params: {
          search,
          status,
        },
      }),
      providesTags: ["Member"],
    }),

    // 3️⃣ Get referral tree
    getReferralTreeForMember: builder.query({
      query: () => ({
        url: "/member/referral-tree",
        method: "GET",
      }),
      providesTags: ["Member"],
    }),

    // 4️⃣ Get Member by Username
    getMemberByUsername: builder.query({
      query: (username) => ({
        url: `/member/username/${username}`,
        method: "GET",
      }),
      providesTags: ["Member"],
    }),
  }),
});

export const {
  useReferNewMemberMutation,
  useGetReferredMembersQuery,
  useGetSponsoredMembersQuery,
  useGetReferralTreeForMemberQuery,
  useGetMemberByUsernameQuery,
  useLazyGetMemberByUsernameQuery,
} = referNewMemberApi;
