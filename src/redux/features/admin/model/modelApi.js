import { baseApi } from "../../../api/baseApi";

export const modelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createModel: builder.mutation({
      query: (data) => ({
        url: "/models",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Model"],
    }),

    // GET ALL (with pagination + search)
    getModels: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        is_active = null,
      } = {}) => {
        let queryString = `/models?per_page=${per_page}&page=${page}`;
        if (search) queryString += `&search=${search}`;
        if (is_active !== null) queryString += `&is_active=${is_active}`;
        return queryString;
      },
      providesTags: ["Model"],
    }),

    // GET ALL (without pagination)
    getAllModels: builder.query({
      query: () => "/models/all",
      providesTags: ["Model"],
    }),

    // GET SINGLE
    getSingleModel: builder.query({
      query: (id) => `/models/${id}`,
      providesTags: (result, error, id) => [{ type: "Model", id }],
    }),

    // UPDATE
    updateModel: builder.mutation({
      query: ({ id, data }) => ({
        url: `/models/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Model", id },
        "Model",
      ],
    }),

    // DELETE
    deleteModel: builder.mutation({
      query: (id) => ({
        url: `/models/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Model"],
    }),
  }),
});

export const {
  useCreateModelMutation,
  useGetModelsQuery,
  useGetAllModelsQuery,
  useGetSingleModelQuery,
  useUpdateModelMutation,
  useDeleteModelMutation,
} = modelApi;
