import { baseApi } from "@/redux/api/baseApi";

export const companyInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get company details
    getCompanyDetails: builder.query({
      query: () => `/admin/company/details`,
      transformResponse: (response) => response?.data?.company || {},
      providesTags: ["CompanyInfo"],
    }),

    // 2. Update company info
    updateCompanyInfo: builder.mutation({
      query: (body) => ({
        url: `/admin/company/update`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CompanyInfo"],
    }),

    // 3. Get CR points
    getCrPoints: builder.query({
      query: () => `/admin/company/cr-points`,
      transformResponse: (response) => response?.data,
      providesTags: ["CompanyInfo"],
    }),

    // 4. Adjust CR points
    adjustCrPoints: builder.mutation({
      query: (body) => ({
        url: `/admin/company/adjust-cr-points`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CompanyInfo"],
    }),

    // 5. Get statistics
    getCompanyStatistics: builder.query({
      query: () => `/admin/company/statistics`,
      transformResponse: (response) => response?.data,
      providesTags: ["CompanyInfo"],
    }),
  }),
});

export const {
  useGetCompanyDetailsQuery,
  useUpdateCompanyInfoMutation,
  useGetCrPointsQuery,
  useAdjustCrPointsMutation,
  useGetCompanyStatisticsQuery,
} = companyInfoApi;
