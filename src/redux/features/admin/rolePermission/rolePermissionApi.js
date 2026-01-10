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
        url: "/admin/roles/permissions/create",
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
        url: `/admin/roles/permissions/update/${id}`,
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
        url: `/admin/roles/permissions/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Permission"],
    }),

    // ============= SECTIONS =============

    // CREATE SECTION
    createSection: builder.mutation({
      query: (data) => ({
        url: "/sections",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Section"],
    }),

    // GET ALL SECTIONS
    getSections: builder.query({
      query: () => "/sections",
      providesTags: ["Section"],
    }),

    // GET SINGLE SECTION
    getSingleSection: builder.query({
      query: (id) => `/sections/${id}`,
      providesTags: (result, error, id) => [{ type: "Section", id }],
    }),

    // UPDATE SECTION
    updateSection: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sections/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Section", id },
        "Section",
      ],
    }),

    // DELETE SECTION
    deleteSection: builder.mutation({
      query: (id) => ({
        url: `/sections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Section"],
    }),

    // ============= ACTIONS =============

    // CREATE ACTION
    createAction: builder.mutation({
      query: (data) => ({
        url: "/actions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Action"],
    }),

    // GET ALL ACTIONS
    getActions: builder.query({
      query: () => "/actions",
      providesTags: ["Action"],
    }),

    // GET SINGLE ACTION
    getSingleAction: builder.query({
      query: (id) => `/actions/${id}`,
      providesTags: (result, error, id) => [{ type: "Action", id }],
    }),

    // UPDATE ACTION
    updateAction: builder.mutation({
      query: ({ id, data }) => ({
        url: `/actions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Action", id },
        "Action",
      ],
    }),

    // DELETE ACTION
    deleteAction: builder.mutation({
      query: (id) => ({
        url: `/actions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Action"],
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
  useCreateSectionMutation,
  useGetSectionsQuery,
  useGetSingleSectionQuery,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useCreateActionMutation,
  useGetActionsQuery,
  useGetSingleActionQuery,
  useUpdateActionMutation,
  useDeleteActionMutation,
} = rolePermissionApi;
