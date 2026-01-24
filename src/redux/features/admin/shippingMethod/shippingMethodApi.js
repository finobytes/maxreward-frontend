import { baseApi } from "../../../api/baseApi";

export const shippingMethodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippingMethods: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        is_active = "",
        sort_by = "",
        sort_order = "",
      } = {}) => {
        let queryString = `/admin/shipping-methods?per_page=${per_page}&page=${page}`;
        if (search) queryString += `&search=${encodeURIComponent(search)}`;
        if (is_active !== "" && is_active !== null && is_active !== undefined) {
          queryString += `&is_active=${is_active}`;
        }
        if (sort_by) queryString += `&sort_by=${encodeURIComponent(sort_by)}`;
        if (sort_order)
          queryString += `&sort_order=${encodeURIComponent(sort_order)}`;
        return queryString;
      },
    }),

    getShippingMethod: builder.query({
      query: (id) => `/admin/shipping-methods/${id}`,
    }),

    createShippingMethod: builder.mutation({
      query: (data) => ({
        url: "/admin/shipping-methods",
        method: "POST",
        body: data,
      }),
    }),

    updateShippingMethod: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/shipping-methods/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteShippingMethod: builder.mutation({
      query: (id) => ({
        url: `/admin/shipping-methods/${id}`,
        method: "DELETE",
      }),
    }),

    toggleShippingMethodStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/shipping-methods/${id}/toggle-status`,
        method: "PATCH",
      }),
    }),

    reorderShippingMethods: builder.mutation({
      query: (orders) => ({
        url: "/admin/shipping-methods/reorder",
        method: "POST",
        body: { orders },
      }),
    }),

    getActiveShippingMethods: builder.query({
      query: () => "/admin/shipping-methods/active",
    }),
  }),
});

export const {
  useGetShippingMethodsQuery,
  useGetShippingMethodQuery,
  useCreateShippingMethodMutation,
  useUpdateShippingMethodMutation,
  useDeleteShippingMethodMutation,
  useToggleShippingMethodStatusMutation,
  useReorderShippingMethodsMutation,
  useGetActiveShippingMethodsQuery,
} = shippingMethodApi;
