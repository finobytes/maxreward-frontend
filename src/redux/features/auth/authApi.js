import { baseApi } from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ userName, password }) => {
        let url = "/member/login"; // default
        if (userName.startsWith("A")) url = "/admin/login";
        else if (userName.startsWith("M")) url = "/merchant/login";
        else if (userName.startsWith("C")) url = "/member/login";
        else if (/^\d+$/.test(userName)) url = "/member/login";

        return {
          url,
          method: "POST",
          body: { user_name: userName, password },
        };
      },
    }),

    logout: builder.mutation({
      query: (role) => {
        let url = "/member/logout";
        if (role === "admin") url = "/admin/logout";
        else if (role === "merchant") url = "/merchant/logout";

        return { url, method: "POST" };
      },
    }),

    verifyMe: builder.query({
      query: (role) => {
        let url = "/member/me";
        if (role === "admin") url = "/admin/me";
        else if (role === "merchant") url = "/merchant/me";
        return { url };
      },
    }),

    refreshToken: builder.mutation({
      query: (role) => {
        let url = "/member/refresh";
        if (role === "admin") url = "/admin/refresh";
        else if (role === "merchant") url = "/merchant/refresh";
        return { url, method: "POST" };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useVerifyMeQuery,
  useRefreshTokenMutation,
} = authApi;
