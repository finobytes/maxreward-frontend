import { baseApi } from "../../api/baseApi";

export const countriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => ({
        url: "/countries",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCountriesQuery } = countriesApi;
