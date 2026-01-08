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

    // ============= PERMISSIONS =============

    // CREATE PERMISSION
    createPermission: builder.mutation({
      query: (data) => ({
        url: "/admin/permissions/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Permission"],
    }),

    // GET ALL PERMISSIONS (with pagination + search)
    getPermissions: builder.query({
      query: ({ page = 1, per_page = 10, search = "" } = {}) =>
        `/admin/roles/permissions?per_page=${per_page}&page=${page}&search=${search}`,
      providesTags: ["Permission"],
    }),

    // GET ALL PERMISSIONS (without pagination)
    getAllPermissions: builder.query({
      query: () => "/admin/permissions",
      providesTags: ["Permission"],
    }),

    // GET SINGLE PERMISSION
    getSinglePermission: builder.query({
      query: (id) => `/admin/permissions/${id}`,
      providesTags: (result, error, id) => [{ type: "Permission", id }],
    }),

    // UPDATE PERMISSION
    updatePermission: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/permissions/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Permission", id },
        "Permission",
      ],
    }),

    // DELETE PERMISSION
    deletePermission: builder.mutation({
      query: (id) => ({
        url: `/admin/permissions/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Permission"],
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
  useCreatePermissionMutation,
  useGetPermissionsQuery,
  useGetAllPermissionsQuery,
  useGetSinglePermissionQuery,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = rolePermissionApi;
