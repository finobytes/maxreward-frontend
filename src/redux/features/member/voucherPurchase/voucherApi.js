// src/redux/features/member/voucherPurchase/voucherApi.js
import { baseApi } from "../../../api/baseApi";

export const voucherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE VOUCHER
    createVoucher: builder.mutation({
      query: (data) => ({
        url: "/member/voucher/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Voucher"],
    }),

    // GET VOUCHERS
    getVouchers: builder.query({
      query: () => ({
        url: "/member/vouchers",
        method: "GET",
      }),
      providesTags: ["Voucher"],
      transformResponse: (response) => response?.data?.vouchers || [],
    }),

    // ✅ APPROVE VOUCHER (Admin)
    approveVoucher: builder.mutation({
      query: (voucherId) => ({
        url: `/admin/vouchers/${voucherId}/approve`,
        method: "POST",
        body: {}, // empty body
      }),
      invalidatesTags: ["Voucher"],
    }),
  }),
});

export const {
  useCreateVoucherMutation,
  useGetVouchersQuery,
  useApproveVoucherMutation, // ✅ export this
} = voucherApi;
