// src/redux/features/member/voucher/voucherApi.js
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

    getVouchers: builder.query({
      query: () => ({
        url: "/member/vouchers",
        method: "GET",
      }),
      providesTags: ["Voucher"],
      transformResponse: (response) => response?.data?.vouchers || [],
    }),
  }),
});

export const { useCreateVoucherMutation, useGetVouchersQuery } = voucherApi;
