import { baseApi } from "../../../api/baseApi";

export const referNewMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1️⃣ Refer a new member
    referNewMember: builder.mutation({
      query: (data) => {
        const payload = {
          name: data.fullName,
          phone: data.phoneNumber,
          email: data.email,
          gender_type: data.gender || "male",
          address: data.address || "N/A",
        };

        // if admin add → member_id
        if (data.member_id) {
          payload.member_id = data.member_id;
        }

        return {
          url: "/member/refer-new-member",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["Member"],
    }),

    // 2️⃣ Get referred members
    getReferredMembers: builder.query({
      query: () => ({
        url: "/member/referred-members",
        method: "GET",
      }),
      providesTags: ["Member"],
    }),

    // 3️⃣ Get referral tree
    getReferralTree: builder.query({
      query: () => ({
        url: "/member/referral-tree",
        method: "GET",
      }),
      providesTags: ["Member"],
    }),
  }),
});

export const {
  useReferNewMemberMutation,
  useGetReferredMembersQuery,
  useGetReferralTreeQuery,
} = referNewMemberApi;
