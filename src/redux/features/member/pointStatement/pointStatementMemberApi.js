import { baseApi } from "../../../api/baseApi";

export const pointStatementMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 2️⃣ Get referred members
    getPointStatement: builder.query({
      query: (id) => `/transactions/${id}/member`
    }),

  }),
});

export const {
  useGetPointStatementQuery
} = pointStatementMemberApi;
