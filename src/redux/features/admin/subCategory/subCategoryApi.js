import { baseApi } from "../../../api/baseApi";

export const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createSubCategory: builder.mutation({
      query: (data) => ({
        url: "/sub-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubCategory"],
    }),

    // GET ALL (with pagination + search)
    getSubCategories: builder.query({
      query: ({ page = 1, per_page = 10, search = "" } = {}) =>
        `/sub-categories?per_page=${per_page}&page=${page}&search=${search}`,
      providesTags: ["SubCategory"],
    }),

    // GET ALL (without pagination)
    getAllSubCategories: builder.query({
      query: () => "/sub-categories/all",
      providesTags: ["SubCategory"],
    }),

    // GET SINGLE
    getSingleSubCategory: builder.query({
      query: (id) => `/sub-categories/${id}`,
      providesTags: (result, error, id) => [{ type: "SubCategory", id }],
    }),

    // UPDATE
    updateSubCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sub-categories/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SubCategory", id },
        "SubCategory",
      ],
    }),

    // DELETE
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/sub-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubCategory"],
    }),
  }),
});

export const {
  useCreateSubCategoryMutation,
  useGetSubCategoriesQuery,
  useGetAllSubCategoriesQuery,
  useGetSingleSubCategoryQuery,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;
