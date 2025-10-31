// src/redux/features/admin/denomination/denominationApi.js
import { baseApi } from "../../../api/baseApi";

export const denominationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createDenomination: builder.mutation({
      query: (data) => ({
        url: "/denominations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Denomination"],
    }),

    // GET ALL (paginated + search)
    getDenominations: builder.query({
      query: ({ page = 1, per_page = 10, search = "" } = {}) =>
        `/denominations?per_page=${per_page}&page=${page}&search=${search}`,
      providesTags: ["Denomination"],
    }),

    // GET ALL (without pagination)
    getAllDenominations: builder.query({
      query: () => "/denominations/all",
      providesTags: ["Denomination"],
    }),

    // GET SINGLE
    getSingleDenomination: builder.query({
      query: (id) => `/denominations/${id}`,
      providesTags: (result, error, id) => [{ type: "Denomination", id }],
    }),

    // UPDATE
    updateDenomination: builder.mutation({
      query: ({ id, data }) => ({
        url: `/denominations/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Denomination", id },
        "Denomination",
      ],
    }),

    // DELETE
    deleteDenomination: builder.mutation({
      query: (id) => ({
        url: `/denominations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Denomination"],
    }),
  }),
});

export const {
  useCreateDenominationMutation,
  useGetDenominationsQuery,
  useGetAllDenominationsQuery,
  useGetSingleDenominationQuery,
  useUpdateDenominationMutation,
  useDeleteDenominationMutation,
} = denominationApi;
