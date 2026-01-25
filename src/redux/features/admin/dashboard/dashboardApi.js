import { baseApi } from "../../../api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET admin dashboard stats
    getDashboardStats: builder.query({
      query: () => "/admin/dashboard-stats",
      transformResponse: (response) => response?.data || response,
      providesTags: ["DashboardStats"],
    }),
    // GET admin real-time transactions
    getRealTimeTransactions: builder.query({
      query: () => "/admin/real-time-transactions",
      transformResponse: (response) => response?.data || response,
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetRealTimeTransactionsQuery } =
  dashboardApi;
