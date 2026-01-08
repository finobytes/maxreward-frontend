import { baseApi } from "../../../api/baseApi";

export const rolePermissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE ROLE
    createRole: builder.mutation({
      query: (data) => ({
        url: "/admin/roles/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    // GET ALL ROLES (with pagination + search)
    getRoles: builder.query({
      query: ({ page = 1, per_page = 10, search = "" } = {}) =>
        `/admin/roles?per_page=${per_page}&page=${page}&search=${search}`,
      providesTags: ["Role"],
    }),

    // GET ALL ROLES (without pagination)
    getAllRoles: builder.query({
      query: () => "/admin/roles",
      providesTags: ["Role"],
    }),

    // GET SINGLE ROLE
    getSingleRole: builder.query({
      query: (id) => `/admin/roles/${id}`,
      providesTags: (result, error, id) => [{ type: "Role", id }],
    }),

    // UPDATE ROLE
    updateRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/roles/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Role", id },
        "Role",
      ],
    }),

    // DELETE ROLE
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/admin/roles/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const {
  useCreateRoleMutation,
  useGetRolesQuery,
  useGetAllRolesQuery,
  useGetSingleRoleQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolePermissionApi;
