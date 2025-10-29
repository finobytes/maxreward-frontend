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
  }),
});

export const { useCreateVoucherMutation, useGetVouchersQuery } = voucherApi;
