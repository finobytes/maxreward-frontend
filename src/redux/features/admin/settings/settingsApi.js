import { baseApi } from "../../../api/baseApi";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE or UPDATE
    createOrUpdate: builder.mutation({
      query: (data) => ({
        url: "/settings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),

    // GET current settings
    getCurrentSettings: builder.query({
      query: () => "/settings",
      transformResponse: (response) => response?.data || response,
      providesTags: ["Settings"],
    }),
  }),
});

export const { useCreateOrUpdateMutation, useGetCurrentSettingsQuery } =
  settingsApi;
