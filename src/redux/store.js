import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import memberManagementReducer from "./features/admin/memberManagement/memberManagementSlice";
import merchantManagementReducer from "./features/admin/merchantManagement/merchantManagementSlice";
import merchantStaffReducer from "./features/merchant/merchantStaff/merchantStaffSlice";
import adminStaffReducer from "./features/admin/adminStaff/adminStaffSlice";
import businessTypeReducer from "./features/admin/businessType/businessTypeSlice";
import denominationReducer from "./features/admin/denomination/denominationSlice";
import voucherReducer from "./features/member/voucherPurchase/voucherSlice";
import referNewMemberReducer from "./features/member/referNewMember/referNewMemberSlice";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    memberManagement: memberManagementReducer,
    merchantManagement: merchantManagementReducer,
    merchantStaff: merchantStaffReducer,
    adminStaff: adminStaffReducer,
    businessType: businessTypeReducer,
    denomination: denominationReducer,
    voucher: voucherReducer,
    referNewMember: referNewMemberReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
