import { baseApi } from "../../../../api/baseApi";

export const whatsappLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All WhatsApp Logs with pagination & search
    getAllWhatsAppLogs: builder.query({
      query: ({ page = 1, search = "" } = {}) => {
        let url = `/whatsapp-logs?page=${page}`;
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

      providesTags: ["WhatsAppLogs"],
    }),
  }),
});

export const { useGetAllWhatsAppLogsQuery } = whatsappLogApi;
