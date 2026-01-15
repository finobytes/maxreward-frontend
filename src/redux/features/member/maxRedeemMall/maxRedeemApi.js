import { baseApi } from "../../../api/baseApi";

export const maxRedeemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/member/cart",
      transformResponse: (res) => res.data,
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/member/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart", "CartCount"],
    }),
    updateCartItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/member/cart/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (id) => ({
        url: `/member/cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart", "CartCount"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "/member/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart", "CartCount"],
    }),
    getCartCount: builder.query({
      query: () => "/member/cart/count",
      transformResponse: (res) => res.data?.cart_count || 0,
      providesTags: ["CartCount"],
    }),
    purchaseProduct: builder.mutation({
      query: (data) => ({
        url: "/max-redeem/purchase",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Wallet", "Cart", "CartCount"],
    }),
  }),
});

export const {
  usePurchaseProductMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useGetCartCountQuery,
} = maxRedeemApi;
