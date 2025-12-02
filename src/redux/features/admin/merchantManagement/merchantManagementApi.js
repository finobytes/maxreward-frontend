import { baseApi } from "../../../api/baseApi";

export const merchantManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET — All merchants (supports pagination, filters, and search)
    getMerchants: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        status,
        business_type,
        search,
      } = {}) => {
        const params = new URLSearchParams({
          page,
          per_page,
          ...(status && { status }),
          ...(business_type && { business_type }),
          ...(search && { search }),
        });

        return `/merchants?${params.toString()}`;
      },
      transformResponse: (response) => {
        // Normalize Laravel-style pagination
        const merchants = response?.data?.data ?? [];
        const pagination = {
          currentPage: response?.data?.current_page ?? 1,
          lastPage: response?.data?.last_page ?? 1,
          perPage: response?.data?.per_page ?? 10,
          total: response?.data?.total ?? 0,
        };
        return { merchants, pagination };
      },
      providesTags: (result) => {
        if (!result?.merchants) {
          return [{ type: "Merchant", id: "LIST" }];
        }
        return [
          ...result.merchants.map((merchant) => ({
            type: "Merchant",
            id: merchant.id,
          })),
          { type: "Merchant", id: "LIST" },
        ];
      },
    }),

    // GET — Single merchant by ID
    getMerchantById: builder.query({
      query: (id) => `/merchants/${id}`,
      providesTags: (result, error, id) => [{ type: "Merchant", id }],
    }),

    // GET — Merchant by unique number
    getMerchantByUnique: builder.query({
      query: (unique) => `/merchants/unique/${unique}`,
      providesTags: (result, error, unique) => [
        { type: "Merchant", id: unique },
      ],
    }),

    // POST — Create new merchant
    createMerchant: builder.mutation({
      query: (merchantData) => ({
        url: `/merchants`,
        method: "POST",
        body: merchantData,
      }),
      invalidatesTags: [{ type: "Merchant", id: "LIST" }],
    }),

    // POST — Update merchant by ID
    updateMerchant: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/merchants/${id}`,
        method: "POST",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Merchant", id },
        { type: "Merchant", id: "LIST" },
      ],
    }),

    // DELETE — Delete merchant by ID
    deleteMerchant: builder.mutation({
      query: (id) => ({
        url: `/merchants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Merchant", id },
        { type: "Merchant", id: "LIST" },
      ],
    }),
    suspendMerchant: builder.mutation({
      query: ({ merchantId, status = "suspended", suspendReason }) => ({
        url: "/admin/merchant-suspend",
        method: "POST",
        body: {
          merchant_id: merchantId,
          status,
          ...(suspendReason && { suspended_reason: suspendReason }),
        },
      }),
      invalidatesTags: (result, error, { merchantId }) => [
        { type: "Merchant", id: merchantId },
        { type: "Merchant", id: "LIST" },
      ],
    }),
    blockMerchant: builder.mutation({
      query: ({ merchantId, id, status = "rejected", rejectReason }) => {
        const targetId = merchantId ?? id;
        return {
          url: "/admin/merchant-rejected",
          method: "POST",
          body: {
            merchant_id: targetId,
            status,
            ...(rejectReason && { rejected_reason: rejectReason }),
          },
        };
      },
      invalidatesTags: (result, error, { merchantId, id }) => {
        const targetId = merchantId ?? id;
        const tags = [{ type: "Merchant", id: "LIST" }];
        if (targetId) {
          tags.push({ type: "Merchant", id: targetId });
        }
        return tags;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMerchantsQuery,
  useGetMerchantByIdQuery,
  useGetMerchantByUniqueQuery,
  useCreateMerchantMutation,
  useUpdateMerchantMutation,
  useDeleteMerchantMutation,
  useSuspendMerchantMutation,
  useBlockMerchantMutation,
} = merchantManagementApi;
