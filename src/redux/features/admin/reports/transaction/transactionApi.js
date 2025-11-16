// src/redux/features/admin/transactions/transactionsApi.js
import { baseApi } from "../../../../api/baseApi";

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET All Transactions with pagination & search
    getAllTransactions: builder.query({
      query: ({ page = 1, search = "" } = {}) => {
        let url = `/transactions?page=${page}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        return url;
      },
      transformResponse: (response) => ({
        transactions: response?.data?.data || [],
        pagination: {
          currentPage: response?.data?.current_page || 1,
          totalPages: response?.data?.last_page || 1,
          total: response?.data?.total || 0,
          perPage: response?.data?.per_page || 10,
        },
        statistics: response?.statistics || {},
      }),
      providesTags: ["Transactions"],
    }),
  }),
});

export const { useGetAllTransactionsQuery } = transactionsApi;
