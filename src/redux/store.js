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
import voucherManagementReducer from "./features/member/voucherPurchase/voucherSlice";
import voucherFormReducer from "./features/member/voucherPurchase/voucherFormSlice";
import shopWithMerchantReducer from "./features/member/shopWithMerchant/shopWithMerchantSlice";
import purchaseManagementReducer from "./features/member/shopWithMerchant/purchaseManagementSlice";
import transactionsReducer from "./features/merchant/transactions/transactionsSlice";
import pointStatementMemberReducer from "./features/member/pointStatement/pointStatementMemberSlice";
import cpTransactionMemberReducer from "./features/member/cpTransaction/cpTransactionMemberSlice";
import cpTransactionAdminReducer from "./features/admin/cpTransaction/cpTransactionAdminSlice";
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
    voucherManagement: voucherManagementReducer,
    voucherForm: voucherFormReducer,
    shopWithMerchant: shopWithMerchantReducer,
    purchaseManagement: purchaseManagementReducer,
    transactions: transactionsReducer,
    pointStatementMember: pointStatementMemberReducer,
    cpTransactionMember: cpTransactionMemberReducer,
    cpTransactionAdmin: cpTransactionAdminReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
