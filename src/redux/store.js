import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import memberManagementReducer from "./features/admin/memberManagement/memberManagementSlice";
import merchantManagementReducer from "./features/admin/merchantManagement/merchantManagementSlice";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    memberManagement: memberManagementReducer,
    merchantManagement: merchantManagementReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
