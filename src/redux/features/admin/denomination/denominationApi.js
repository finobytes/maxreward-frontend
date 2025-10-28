import { baseApi } from "../../../api/baseApi";

export const denominationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDenomination: builder.query({
      query: (params) => ({
        url: "/denominations",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetDenominationQuery } = denominationApi;
