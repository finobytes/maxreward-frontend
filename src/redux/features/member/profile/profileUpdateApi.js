import { baseApi } from "../../../api/baseApi";

export const profileUpdateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateMemberProfile: builder.mutation({
      query: (formData) => ({
        url: "/member/update-profile",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Member"],
    }),
  }),
});

export const { useUpdateMemberProfileMutation } = profileUpdateApi;
