import { baseApi } from "../../../api/baseApi";

export const businessTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createBusinessType: builder.mutation({
      query: (data) => ({
        url: "/business-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BusinessType"],
    }),

    // GET ALL (with pagination + search)
    getBusinessTypes: builder.query({
      query: ({ page = 1, per_page = 10, search = "" } = {}) =>
        `/business-types?per_page=${per_page}&page=${page}&search=${search}`,
      providesTags: ["BusinessType"],
    }),

    // GET ALL (without pagination)
    getAllBusinessTypes: builder.query({
      query: () => "/business-types/all",
      providesTags: ["BusinessType"],
    }),

    // GET SINGLE
    getSingleBusinessType: builder.query({
      query: (id) => `/business-types/${id}`,
      providesTags: (result, error, id) => [{ type: "BusinessType", id }],
    }),

    // UPDATE
    updateBusinessType: builder.mutation({
      query: ({ id, data }) => ({
        url: `/business-types/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "BusinessType", id },
        "BusinessType",
      ],
    }),

    // DELETE
    deleteBusinessType: builder.mutation({
      query: (id) => ({
        url: `/business-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BusinessType"],
    }),
  }),
});

export const {
  useCreateBusinessTypeMutation,
  useGetBusinessTypesQuery,
  useGetAllBusinessTypesQuery,
  useGetSingleBusinessTypeQuery,
  useUpdateBusinessTypeMutation,
  useDeleteBusinessTypeMutation,
} = businessTypeApi;
