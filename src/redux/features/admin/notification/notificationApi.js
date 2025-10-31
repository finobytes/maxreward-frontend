import { baseApi } from "../../../api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all notifications (with pagination + optional search/filter)
    getAllNotifications: builder.query({
      query: ({ page = 1, search = "", status = "", type = "" } = {}) => {
        let url = `/notifications?page=${page}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (status) url += `&status=${status}`;
        if (type) url += `&type=${type}`;
        return url;
      },
      transformResponse: (response) => ({
        notifications: response?.data?.data || [],
        pagination: {
          currentPage: response?.data?.current_page || 1,
          totalPages: response?.data?.last_page || 1,
          total: response?.data?.total || 0,
          perPage: response?.data?.per_page || 10,
        },
        statistics: response?.data?.statistics || {},
      }),
      providesTags: ["Notifications"],
    }),

    // ✅ Get single notification details
    getNotificationById: builder.query({
      query: (id) => `/notifications/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: "Notifications", id }],
    }),

    // ✅ Mark notification as read
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ✅ Mark all as read
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: `/notifications/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useGetNotificationByIdQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi;
