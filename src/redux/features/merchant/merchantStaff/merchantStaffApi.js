import { baseApi } from "../../../api/baseApi";

export const merchantStaffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET — All Staffs (no query params)
    getAllStaffs: builder.query({
      query: (merchantId) => `/staffs/merchant/${merchantId}`,
      transformResponse: (response) => {
        const data = response?.data || {};
        return {
          staffs: data.staffs || [],
          pagination: {
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total: data.total || 0,
          },
        };
      },
      providesTags: (result) =>
        result?.staffs?.length
          ? [
              ...result.staffs.map(({ id }) => ({ type: "Staff", id })),
              { type: "Staff", id: "LIST" },
            ]
          : [{ type: "Staff", id: "LIST" }],
    }),

    // GET — Single staff
    getStaffById: builder.query({
      query: (id) => `/staffs/${id}`,
      providesTags: (result, error, id) => [{ type: "Staff", id }],
    }),

    // GET — All staffs under a merchant
    getStaffsByMerchantId: builder.query({
      query: (merchantId) => `/staffs/merchant/${merchantId}`,
      transformResponse: (response) => response?.data?.data ?? [],
      providesTags: (result, error, merchantId) => [
        { type: "Staff", id: `MERCHANT-${merchantId}` },
      ],
    }),

    // POST — Create staff
    createStaff: builder.mutation({
      query: (staffData) => ({
        url: `/staffs`,
        method: "POST",
        body: staffData,
      }),
      invalidatesTags: [{ type: "Staff", id: "LIST" }],
    }),

    // PATCH — Update staff
    updateStaff: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/staffs/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Staff", id },
        { type: "Staff", id: "LIST" },
      ],
    }),

    // DELETE — Delete staff
    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `/staffs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Staff", id },
        { type: "Staff", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllStaffsQuery,
  useGetStaffByIdQuery,
  useGetStaffsByMerchantIdQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = merchantStaffApi;
