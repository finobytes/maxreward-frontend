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

    makePurchaseForMember: builder.mutation({
      query: (body) => ({
        url: "/members/make-purchase",
        method: "POST",
        body,
      }),
    }),

    getMemberPurchases: builder.query({
      query: ({ memberId, page = 1, search, status }) => {
        const params = new URLSearchParams();
        params.set("page", page);
        if (search) params.set("search", search);
        if (status && status !== "all") params.set("status", status);

        const queryString = params.toString();

        return {
          url: `/members/${memberId}/purchases${
            queryString ? `?${queryString}` : ""
          }`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        const payload = response?.data ?? {};

        return {
          purchases: payload?.data ?? [],
          pagination: {
            currentPage: payload?.current_page ?? 1,
            lastPage: payload?.last_page ?? 1,
            total: payload?.total ?? payload?.data?.length ?? 0,
            perPage: payload?.per_page ?? 10,
          },
          summary: response?.summary ?? {},
          success: response?.success ?? false,
          message: response?.message ?? "",
        };
      },
      providesTags: ["MemberPurchases"],
    }),
  }),
});

export const {
  useGetMerchantMutation,
  useCheckMemberRedeemAmountMutation,
  useMakePurchaseForMemberMutation,
  useGetMemberPurchasesQuery,
} = shopWithMerchantApi;
