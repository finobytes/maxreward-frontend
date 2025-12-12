import { baseApi } from "../../../api/baseApi";

export const attributeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createAttribute: builder.mutation({
      query: (data) => ({
        url: "/admin/attributes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attribute"],
    }),

    // GET ALL (with pagination + search)
    getAttributes: builder.query({
      query: ({ page = 1, per_page = 10, search = "" } = {}) => {
        let queryString = `/admin/attributes?per_page=${per_page}&page=${page}`;
        if (search) queryString += `&search=${search}`;
        return queryString;
      },
      providesTags: ["Attribute"],
    }),

    // GET ALL (without pagination)
    getAllAttributes: builder.query({
      query: () => "/admin/attributes/all",
      providesTags: ["Attribute"],
    }),

    // GET SINGLE
    getSingleAttribute: builder.query({
      query: (id) => `/admin/attributes/${id}`,
      providesTags: (result, error, id) => [{ type: "Attribute", id }],
    }),

    // UPDATE
    updateAttribute: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/attributes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Attribute", id },
        "Attribute",
      ],
    }),

    // DELETE
    deleteAttribute: builder.mutation({
      query: (id) => ({
        url: `/admin/attributes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attribute"],
    }),
  }),
});

export const {
  useCreateAttributeMutation,
  useGetAttributesQuery,
  useGetAllAttributesQuery,
  useGetSingleAttributeQuery,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
} = attributeApi;
