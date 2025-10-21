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
} = memberApi;
