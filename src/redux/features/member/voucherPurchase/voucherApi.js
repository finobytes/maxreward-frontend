import { baseApi } from "../../../api/baseApi";

export const voucherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // === inside baseApi.injectEndpoints({ endpoints: (builder) => ({ ... }) })

    // === Member vouchers (no pagination)
    getMemberVouchers: builder.query({
      query: (page = 1) => ({
        url: `/member/vouchers`,
        method: "GET",
        params: { page }, // <-- send page
      }),

      transformResponse: (response) => {
        if (!response?.success) {
          return {
            vouchers: [],
            message: response?.message || "Failed to fetch vouchers",
          };
        }

        const vouchers = response?.data?.vouchers ?? {};
        return { vouchers };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.vouchers.data.map((v) => ({
                type: "Voucher",
                id: v.id,
              })),
              { type: "Voucher", id: "LIST" },
            ]
          : [{ type: "Voucher", id: "LIST" }],

      keepUnusedDataFor: 60,
    }),

    // Admin: Get all vouchers (filtered)
    getVouchers: builder.query({
      query: (params) => ({
        url: "/admin/vouchers",
        method: "GET",
        params: {
          member_id: params?.member_id,
          payment_method: params?.payment_method,
          voucher_type: params?.voucher_type,
          status: params?.status,
          search: params?.search, // <-- send search
          page: params?.page, // <-- send page
        },
      }),
      transformResponse: (response) => {
        // Same robust parsing as above
        const container = response?.data ?? response;
        const pagination = container?.vouchers ?? container;
        const vouchersArray =
          pagination?.data ?? (Array.isArray(pagination) ? pagination : []);
        const meta = {
          current_page: pagination?.current_page ?? pagination?.page ?? 1,
          last_page:
            pagination?.last_page ??
            Math.ceil((pagination?.total ?? 0) / (pagination?.per_page ?? 10)),
          total:
            pagination?.total ??
            (Array.isArray(vouchersArray) ? vouchersArray.length : 0),
          per_page: pagination?.per_page ?? 10,
        };
        return { vouchers: vouchersArray ?? [], meta };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.vouchers.map((v) => ({ type: "Voucher", id: v.id })),
              { type: "Voucher", id: "LIST" },
            ]
          : [{ type: "Voucher", id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    // Get single voucher by ID For Admin
    getVoucherById: builder.query({
      query: (id) => `/admin/vouchers/${id}`,
      transformResponse: (res) => res?.data ?? res,
      providesTags: (result, err, id) => [{ type: "Voucher", id }],
    }),
    // Get single voucher by ID For member
    getVoucherByIdForMember: builder.query({
      query: (id) => `/member/${id}/vouchers`,
      transformResponse: (res) => res?.data ?? res,
      providesTags: (result, err, id) => [{ type: "Voucher", id }],
    }),
    // Create voucher (Member)
    createVoucher: builder.mutation({
      query: (formData) => ({
        url: "/member/voucher/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Voucher", id: "LIST" }],
    }),

    verifyPayment: builder.mutation({
      query: (data) => ({
        url: "/member/verify-payment/voucher",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Voucher", id: "LIST" }],
    }),

    cancelPayment: builder.mutation({
      query: (data) => ({
        url: "/member/cancel-payment/voucher",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Voucher", id: "LIST" }],
    }),

    // Update voucher
    updateVoucher: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/vouchers/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, err, { id }) => [
        { type: "Voucher", id },
        { type: "Voucher", id: "LIST" },
      ],
    }),

    // Admin: Approve voucher
    approveVoucher: builder.mutation({
      query: (id) => ({
        url: `/admin/vouchers/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, err, id) => [
        { type: "Voucher", id },
        { type: "Voucher", id: "LIST" },
      ],
    }),

    //  Admin: Reject voucher
    rejectVoucher: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `/admin/vouchers/${id}/status-change`,
        method: "POST",
        body: {
          status: status ?? "rejected",
          reason,
        },
      }),
      invalidatesTags: (result, err, { id }) => [
        { type: "Voucher", id },
        { type: "Voucher", id: "LIST" },
      ],
    }),

    // Delete voucher (if needed)
    deleteVoucher: builder.mutation({
      query: (id) => ({
        url: `/vouchers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Voucher", id: "LIST" }],
    }),
  }),
});

export const {
  useGetVouchersQuery,
  useGetMemberVouchersQuery,
  useGetVoucherByIdQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useApproveVoucherMutation,
  useRejectVoucherMutation,
  useDeleteVoucherMutation,
  useGetVoucherByIdForMemberQuery,
  useVerifyPaymentMutation,
  useCancelPaymentMutation,
} = voucherApi;
