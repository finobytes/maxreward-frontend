import { baseApi } from "../../../api/baseApi";

// Backend response shape (example):
// { success:true, message:"...", data: { current_page:1, data: [...], total: X, per_page:10 } }

export const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/members?page=1&per_page=10&search=...&member_type=...&status=...&sort_by=...&sort_order=...
    getMembers: builder.query({
      query: (params) => ({
        url: "/members",
        method: "GET",
        params,
      }),
      // normalize backend shape into { members, meta }
      transformResponse: (response) => {
        const payload = response?.data ?? response;
        return {
          members: payload?.data ?? [],
          meta: {
            current_page: payload?.current_page ?? payload?.page ?? 1,
            last_page:
              payload?.last_page ??
              Math.ceil((payload?.total ?? 0) / (payload?.per_page ?? 10)),
            total: payload?.total ?? 0,
            per_page: payload?.per_page ?? 10,
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.members.map((m) => ({ type: "Member", id: m.id })),
              { type: "Member", id: "LIST" },
            ]
          : [{ type: "Member", id: "LIST" }],
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: false,
    }),

    getMemberById: builder.query({
      query: (id) => `/members/${id}`,
      transformResponse: (res) => res?.data ?? res,
      providesTags: (result, err, id) => [{ type: "Member", id }],
    }),

    getMemberByUsername: builder.query({
      query: (username) => `/members/username/${username}`,
      transformResponse: (res) => res?.data ?? res,
    }),

    getMemberByReferral: builder.query({
      query: (code) => `/members/referral/${code}`,
      transformResponse: (res) => res?.data ?? res,
    }),

    getGeneralMembers: builder.query({
      query: (params) => ({ url: "/members/general", params }),
      transformResponse: (res) => {
        const payload = res?.data ?? res;
        return {
          members: payload?.data ?? [],
          meta: { current_page: payload?.current_page },
        };
      },
    }),

    getCorporateMembers: builder.query({
      query: (params) => ({ url: "/members/corporate", params }),
      transformResponse: (res) => {
        const payload = res?.data ?? res;
        return {
          members: payload?.data ?? [],
          meta: { current_page: payload?.current_page },
        };
      },
    }),

    updateMember: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/members/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Member", id },
        { type: "Member", id: "LIST" },
      ],
    }),
    updateStatus: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/members/status/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Member", id },
        { type: "Member", id: "LIST" },
      ],
    }),
    blockOrSuspendMember: builder.mutation({
      query: ({ memberId, status, reason }) => {
        const payload = {
          member_id: memberId,
          status,
        };

        if (reason) {
          payload.reason = reason;
        }

        return {
          url: "/member/status/block-suspend",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: (result, error, { memberId }) => [
        { type: "Member", id: memberId },
        { type: "Member", id: "LIST" },
      ],
    }),
    // Get member referral tree from admin
    getReferralTree: builder.query({
      query: (id) => ({
        url: `/members/${id}/community-tree`,
        method: "GET",
      }),
      providesTags: ["Member"],
    }),
    // Get member upline members from admin
    getUpLineMember: builder.query({
      query: (id) => ({
        url: `/member/${id}/upline`,
        method: "GET",
      }),
      providesTags: ["Member"],
    }),

    getReferralMemberList: builder.query({
      query: ({ memberId, page, search, status }) => ({
        url: `/members/${memberId}/referrals`,
        params: {
          page,
          search,
          status,
        },
      }),

      transformResponse: (res) => {
        const payload = res?.data ?? {};

        return {
          members: payload?.data ?? [],
          meta: {
            current_page: payload?.current_page ?? 1,
            last_page: payload?.last_page ?? 1,
            total: payload?.total ?? 0,
            per_page: payload?.per_page ?? 20,
          },
        };
      },
    }),

    getCorporateMemberReferralCode: builder.query({
      query: () => ({
        url: `/member/maxreward-corporate-1`,
      }),
    }),
  }),
});

export const {
  useGetMembersQuery,
  useGetMemberByIdQuery,
  useGetMemberByUsernameQuery,
  useGetMemberByReferralQuery,
  useGetGeneralMembersQuery,
  useGetCorporateMembersQuery,
  useUpdateMemberMutation,
  useUpdateStatusMutation,
  useBlockOrSuspendMemberMutation,
  useGetReferralTreeQuery,
  useGetReferralMemberListQuery,
  useGetUpLineMemberQuery,
  useGetCorporateMemberReferralCodeQuery,
} = memberApi;
