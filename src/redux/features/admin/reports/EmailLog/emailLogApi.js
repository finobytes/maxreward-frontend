import { baseApi } from "../../../../api/baseApi";

export const emailLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Email Logs with pagination & search
    getAllEmailLogs: builder.query({
      query: ({ page = 1, search = "" } = {}) => {
        let url = `/email-logs?page=${page}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        return url;
      },
      transformResponse: (response) => ({
        logs: response?.data?.data || [],
        pagination: {
          currentPage: response?.data?.current_page || 1,
          totalPages: response?.data?.last_page || 1,
          total: response?.data?.total || 0,
          perPage: response?.data?.per_page || 15, // Laravel default
        },
      }),

      providesTags: ["EmailLogs"],
    }),
  }),
});

export const { useGetAllEmailLogsQuery } = emailLogApi;
