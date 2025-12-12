import { baseApi } from "../../../api/baseApi";

export const attributeItemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createAttributeItem: builder.mutation({
      query: (data) => ({
        url: "/admin/attribute-items",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AttributeItem"],
    }),

    // GET ALL (with pagination + search)
    getAttributeItems: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        is_active = null,
        attribute_id = "",
      } = {}) => {
        let queryString = `/admin/attribute-items?per_page=${per_page}&page=${page}`;
        if (search) queryString += `&search=${search}`;
        if (is_active !== null) queryString += `&is_active=${is_active}`;
        if (attribute_id) queryString += `&attribute_id=${attribute_id}`;
        return queryString;
      },
      providesTags: ["AttributeItem"],
    }),

    // GET ALL (without pagination)
    getAllAttributeItems: builder.query({
      query: () => "/admin/attribute-items/all",
      providesTags: ["AttributeItem"],
    }),

    // GET SINGLE
    getSingleAttributeItem: builder.query({
      query: (id) => `/admin/attribute-items/${id}`,
      providesTags: (result, error, id) => [{ type: "AttributeItem", id }],
    }),

    // UPDATE
    updateAttributeItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/attribute-items/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AttributeItem", id },
        "AttributeItem",
      ],
    }),

    // DELETE
    deleteAttributeItem: builder.mutation({
      query: (id) => ({
        url: `/admin/attribute-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AttributeItem"],
    }),
  }),
});

export const {
  useCreateAttributeItemMutation,
  useGetAttributeItemsQuery,
  useGetAllAttributeItemsQuery,
  useGetSingleAttributeItemQuery,
  useUpdateAttributeItemMutation,
  useDeleteAttributeItemMutation,
} = attributeItemApi;
