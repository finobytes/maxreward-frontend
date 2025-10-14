import { baseApi } from "../../../api/baseApi";

export const merchantManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all merchants (with filters, pagination, search)
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
      providesTags: ["Merchant"],
    }),

    // ✅ Get single merchant by ID
    getMerchantById: builder.query({
      query: (id) => `/merchants/${id}`,
      providesTags: (result, error, id) => [{ type: "Merchant", id }],
    }),

    // ✅ Get merchant by unique number
    getMerchantByUnique: builder.query({
      query: (unique) => `/merchants/unique/${unique}`,
      providesTags: (result, error, unique) => [
        { type: "Merchant", id: unique },
      ],
    }),
  }),
});

export const {
  useGetMerchantsQuery,
  useGetMerchantByIdQuery,
  useGetMerchantByUniqueQuery,
} = merchantManagementApi;
