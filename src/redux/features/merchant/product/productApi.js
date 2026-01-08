import { baseApi } from "../../../api/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // GET ALL (with pagination + search + filters)
    getProducts: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
        status = "",
        category_id = "",
        brand_id = "",
        type = "",
        merchant_id = "",
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("per_page", per_page);
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (category_id) params.set("category_id", category_id);
        if (brand_id) params.set("brand_id", brand_id);
        if (type) params.set("type", type);
        if (merchant_id) params.set("merchant_id", merchant_id);

        return `/products?${params.toString()}`;
      },
      transformResponse: (response) => {
        const data = response?.data || {};
        return {
          products: data.data || [],
          pagination: {
            currentPage: data.current_page || 1,
            lastPage: data.last_page || 1,
            perPage: data.per_page || 10,
            total: data.total || 0,
          },
        };
      },
      providesTags: (result) =>
        result?.products?.length
          ? [
              ...result.products.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // GET Merchant Product by ID
    getMerchantProducts: builder.query({
      query: ({
        merchant_id,
        page = 1,
        per_page = 10,
        search = "",
        status = "",
        category_id = "",
        brand_id = "",
        type = "",
        min_price = "",
        max_price = "",
        sort_by = "created_at",
        sort_order = "desc",
      }) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("per_page", per_page);
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (category_id) params.set("category_id", category_id);
        if (brand_id) params.set("brand_id", brand_id);
        if (type) params.set("type", type);
        if (min_price) params.set("min_price", min_price);
        if (max_price) params.set("max_price", max_price);
        if (sort_by) params.set("sort_by", sort_by);
        if (sort_order) params.set("sort_order", sort_order);

        return `/products/merchant/${merchant_id}?${params.toString()}`;
      },
      transformResponse: (response) => {
        const data = response?.data || {};
        return {
          products: data.data || [],
          pagination: {
            currentPage: data.current_page || 1,
            lastPage: data.last_page || 1,
            perPage: data.per_page || 10,
            total: data.total || 0,
          },
        };
      },
      providesTags: (result) =>
        result?.products?.length
          ? [
              ...result.products.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // GET SINGLE
    getSingleProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // UPDATE
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "POST", // Following the pattern in categoryApi
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // GENERATE VARIATIONS
    generateVariations: builder.mutation({
      query: (data) => ({
        url: "/products/generate-variations",
        method: "POST",
        body: data,
      }),
    }),

    // VALIDATE SKU
    validateSku: builder.mutation({
      query: (data) => ({
        url: "/products/validate-sku",
        method: "POST",
        body: data,
      }),
    }),

    // DELETE
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useGetMerchantProductsQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGenerateVariationsMutation,
  useValidateSkuMutation,
} = productApi;
