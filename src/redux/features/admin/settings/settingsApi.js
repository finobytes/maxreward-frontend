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
    // GET CP levels
    getCPLevel: builder.query({
      query: () => "/cp-config",
      transformResponse: (response) => response?.data || response,
      providesTags: ["Settings"],
    }),
    // BULK UPDATE CP levels
    bulkUpdateCPLevel: builder.mutation({
      query: (data) => ({
        url: "/cp-config/bulk/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),

    // UPDATE CP level
    updateCPLevel: builder.mutation({
      query: ({ id, data }) => ({
        url: `/cp-config/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useCreateOrUpdateMutation,
  useGetCurrentSettingsQuery,
  useGetCPLevelQuery,
  useUpdateCPLevelMutation,
  useBulkUpdateCPLevelMutation,
} = settingsApi;
