import { baseApi } from "../../../api/baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // GET ALL (with pagination + search)
    getCategories: builder.query({
      query: ({ page = 1, per_page = 10, search = "" } = {}) =>
        `/categories?per_page=${per_page}&page=${page}&search=${search}`,
      providesTags: ["Category"],
    }),

    // GET ALL (without pagination) - Useful for dropdowns
    getAllCategories: builder.query({
      query: () => "/categories/all",
      providesTags: ["Category"],
    }),

    // GET SINGLE
    getSingleCategory: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // UPDATE
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        "Category",
      ],
    }),

    // DELETE
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
