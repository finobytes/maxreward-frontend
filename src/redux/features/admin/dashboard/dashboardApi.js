import { baseApi } from "../../../api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET admin dashboard stats
    getDashboardStats: builder.query({
      query: () => "/admin/dashboard-stats",
      transformResponse: (response) => response?.data || response,
      providesTags: ["DashboardStats"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
