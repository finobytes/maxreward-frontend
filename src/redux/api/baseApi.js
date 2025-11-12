import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Member",
    "Merchant",
    "MerchantStaff",
    "AdminStaff",
    "BusinessType",
    "CompanyInfo",
    "Settings",
    "MerchantTransactions",
  ],
  endpoints: () => ({}),
});
