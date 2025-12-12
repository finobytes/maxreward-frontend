import { baseApi } from "../../../api/baseApi";

export const genderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createGender: builder.mutation({
      query: (data) => ({
        url: "/admin/genders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Gender"],
    }),

    // GET ALL (with pagination + search)
    getGenders: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        is_active = null,
      } = {}) => {
        let queryString = `/admin/genders?per_page=${per_page}&page=${page}`;
        if (search) queryString += `&search=${search}`;
        if (is_active !== null) queryString += `&is_active=${is_active}`;
        return queryString;
      },
      providesTags: ["Gender"],
    }),

    // GET ALL (without pagination)
    getAllGenders: builder.query({
      query: () => "/admin/genders/all",
      providesTags: ["Gender"],
    }),

    // GET SINGLE
    getSingleGender: builder.query({
      query: (id) => `/admin/genders/${id}`,
      providesTags: (result, error, id) => [{ type: "Gender", id }],
    }),

    // UPDATE
    updateGender: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/genders/${id}`,
        method: "PUT", // Controller supports PUT/PATCH.
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Gender", id },
        "Gender",
      ],
    }),

    // DELETE
    deleteGender: builder.mutation({
      query: (id) => ({
        url: `/admin/genders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Gender"],
    }),
  }),
});

export const {
  useCreateGenderMutation,
  useGetGendersQuery,
  useGetAllGendersQuery,
  useGetSingleGenderQuery,
  useUpdateGenderMutation,
  useDeleteGenderMutation,
} = genderApi;
