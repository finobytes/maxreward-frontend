import { baseApi } from "../../../api/baseApi";

export const shopWithMerchantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //  Get merchant by unique number
    getMerchant: builder.mutation({
      query: (code) => `merchants/unique/${code}`,
      transformResponse: (res) => res?.data ?? res,
      providesTags: ["ShopWithMerChant"],
      invalidatesTags: ["ShopWithMerChant"],
    }),

    //  Check member redeem amount
    checkMemberRedeemAmount: builder.mutation({
      query: (body) => ({
        url: "members/check-redeem-amount",
        method: "POST",
        body,
      }),
      transformResponse: (res) => res ?? {},
    }),
  }),
});

export const { useGetMerchantMutation, useCheckMemberRedeemAmountMutation } =
  shopWithMerchantApi;
