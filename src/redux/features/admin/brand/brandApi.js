import { baseApi } from "../../../api/baseApi";

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createBrand: builder.mutation({
      query: (data) => ({
        url: "/brands",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),

    // GET ALL (with pagination + search)
    getBrands: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        is_active = null,
        is_featured = null,
      } = {}) => {
        let queryString = `/brands?per_page=${per_page}&page=${page}`;
        if (search) queryString += `&search=${search}`;
        if (is_active !== null) queryString += `&is_active=${is_active}`;
        if (is_featured !== null) queryString += `&is_featured=${is_featured}`;
        return queryString;
      },
      providesTags: ["Brand"],
    }),

    // GET ALL (without pagination) - Useful for dropdowns
    getAllBrands: builder.query({
      query: () => "/brands/all",
      providesTags: ["Brand"],
    }),

    // GET SINGLE
    getSingleBrand: builder.query({
      query: (id) => `/brands/${id}`,
      providesTags: (result, error, id) => [{ type: "Brand", id }],
    }),

    // UPDATE
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: "POST", // Using POST for FormData (or _method=PUT)
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Brand", id },
        "Brand",
      ],
    }),

    // DELETE
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useCreateBrandMutation,
  useGetBrandsQuery,
  useGetAllBrandsQuery,
  useGetSingleBrandQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
