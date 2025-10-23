import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // if token is invalid or expired
  if (result?.error?.status === 401) {
    console.warn("Access token expired, trying to refresh...");

    const userRole = api.getState()?.auth?.user?.role;

    // role based refresh endpoint
    let refreshUrl = "/member/refresh";
    if (userRole === "admin") refreshUrl = "/admin/refresh";
    else if (userRole === "merchant") refreshUrl = "/merchant/refresh";

    // Refresh token request
    const refreshResult = await rawBaseQuery(
      { url: refreshUrl, method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult?.data?.access_token) {
      const newToken = refreshResult.data.access_token;
      console.log("🔁 Token refreshed successfully");

      // new token saved on store
      api.dispatch(
        setCredentials({
          user: api.getState().auth.user,
          token: newToken,
        })
      );

      //  retry again old request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      console.error("❌ Refresh token failed, logging out...");
      api.dispatch(logout());
    }
  }

  return result;
};
