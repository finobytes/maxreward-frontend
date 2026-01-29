import { baseApi } from "../../../api/baseApi";

export const shippingZoneApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippingZones: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        region = "",
        is_active = "",
        sort_by = "",
        sort_order = "",
      } = {}) => {
        let queryString = `/admin/shipping-zones?per_page=${per_page}&page=${page}`;
        if (search) queryString += `&search=${encodeURIComponent(search)}`;
        if (region) queryString += `&region=${encodeURIComponent(region)}`;
        if (is_active !== "" && is_active !== null && is_active !== undefined) {
          queryString += `&is_active=${is_active}`;
        }
        if (sort_by) queryString += `&sort_by=${encodeURIComponent(sort_by)}`;
        if (sort_order)
          queryString += `&sort_order=${encodeURIComponent(sort_order)}`;
        return queryString;
      },
    }),

    getShippingZone: builder.query({
      query: (id) => `/admin/shipping-zones/${id}`,
    }),

    createShippingZone: builder.mutation({
      query: (data) => ({
        url: "/admin/shipping-zones",
        method: "POST",
        body: data,
      }),
    }),

    updateShippingZone: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/shipping-zones/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteShippingZone: builder.mutation({
      query: (id) => ({
        url: `/admin/shipping-zones/${id}`,
        method: "DELETE",
      }),
    }),

    toggleShippingZoneStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/shipping-zones/${id}/toggle-status`,
        method: "PATCH",
      }),
    }),

    getShippingZoneRegions: builder.query({
      query: () => "/admin/shipping-zones/regions",
    }),
  }),
});

export const {
  useGetShippingZonesQuery,
  useGetShippingZoneQuery,
  useCreateShippingZoneMutation,
  useUpdateShippingZoneMutation,
  useDeleteShippingZoneMutation,
  useToggleShippingZoneStatusMutation,
  useGetShippingZoneRegionsQuery,
} = shippingZoneApi;
