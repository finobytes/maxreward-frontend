import { baseApi } from "../../../api/baseApi";

export const adminStaffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Create Admin Staff
    createAdminStaff: builder.mutation({
      query: (data) => ({
        url: "/admin-staffs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdminStaff"],
    }),

    // 2. Get All Admin Staffs (Paginated)
    getAdminStaffs: builder.query({
      query: ({ page = 1, search = "", status = "" }) => {
        let params = new URLSearchParams();
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        params.append("page", page);
        return {
          url: `/admin-staffs?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["AdminStaff"],
      transformResponse: (response) => ({
        staffs: response?.data?.data || [],
        pagination: {
          currentPage: response?.data?.current_page || 1,
          totalPages: response?.data?.last_page || 1,
        },
      }),
    }),

    // 3. Get All Admin Staffs (Without Pagination)
    getAllAdminStaffs: builder.query({
      query: () => ({
        url: "/admin-staffs/all",
        method: "GET",
      }),
      providesTags: ["AdminStaff"],
    }),

    // 4. Get Single Admin Staff
    getSingleAdminStaff: builder.query({
      query: (id) => ({
        url: `/admin-staffs/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AdminStaff", id }],
    }),

    // 5. Update Admin Staff
    updateAdminStaff: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin-staffs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AdminStaff", id },
        "AdminStaff",
      ],
    }),

    // 6. Delete Admin Staff
    deleteAdminStaff: builder.mutation({
      query: (id) => ({
        url: `/admin-staffs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminStaff"],
    }),
  }),
});

export const {
  useCreateAdminStaffMutation,
  useGetAdminStaffsQuery,
  useGetAllAdminStaffsQuery,
  useGetSingleAdminStaffQuery,
  useUpdateAdminStaffMutation,
  useDeleteAdminStaffMutation,
} = adminStaffApi;
