import MemberRegistration from "../pages/merchant/MemberRegistration/MemberRegistration";
import MerchantDashboard from "../pages/merchant/MerchantDashboard/MerchantDashboard";
import RedeemMall from "../pages/merchant/RedeemMall/RedeemMall";
import MemberTransaction from "../pages/merchant/Reports/MemberTransaction";
import AllTransactions from "../pages/merchant/Transactions/AllTransactions";
import PendingApproval from "../pages/merchant/Transactions/PendingApproval";
import VoucherPurchase from "../pages/merchant/VoucherPurchase/VoucherPurchase";
import VoucherPurchaseReport from "../pages/merchant/Reports/VoucherPurchase";
import RedeemMallTransactions from "../pages/merchant/Reports/RedeemMallTransactions";
import Profile from "../pages/merchant/Profile/Profile";
import MerchantStaff from "../pages/merchant/MerchantStaff/MerchantStaff";
import MerchantStaffCreate from "../pages/merchant/MerchantStaff/MerchantStaffCreate";
import MerchantStaffDetails from "../pages/merchant/MerchantStaff/MerchantStaffDetails";
import MerchantStaffUpdate from "../pages/merchant/MerchantStaff/MerchantStaffUpdate";
import VoucherPurchaseForm from "../pages/merchant/VoucherPurchase/VoucherPurchaseForm";
import VoucherPurchaseDetails from "../pages/merchant/VoucherPurchase/VoucherPurchaseDetails";
import ReferredMemberList from "../pages/merchant/ReferredMemberList/ReferredMemberList";
import PointStatement from "../pages/merchant/PointStatement/PointStatement";
import TransactionDetails from "../pages/merchant/PointStatement/TransactionDetails";
import DailyTransaction from "../pages/merchant/Transactions/DailyTransaction";
import Notification from "../pages/merchant/Notification/Notification";
import NotificationDetails from "../pages/merchant/Notification/NotificationDetails";
import ProductForm from "../pages/merchant/ProductManagement/ProductForm";
import ProductDetails from "../pages/merchant/ProductManagement/ProductDetails";
import AvailableTransaction from "../pages/merchant/PointStatement/Available/AvailableTransaction";
import ReferTransaction from "../pages/merchant/PointStatement/Refer/ReferTransaction";
import DraftProducts from "../pages/merchant/ProductManagement/DraftProducts";
import ActiveProducts from "../pages/merchant/ProductManagement/ActiveProducts";
import AssignPermissionsToRole from "../pages/merchant/rolePermission/AssignPermissionsToRole";
import RoleList from "../pages/merchant/rolePermission/RoleList";
import InactiveProducts from "../pages/merchant/ProductManagement/InactiveProducts";
import PendingOrder from "../pages/merchant/orders/PendingOrder";
import CompleteOrder from "../pages/merchant/orders/CompleteOrder";
import CancelOrder from "../pages/merchant/orders/CancelOrder";
import ShippingRateSetting from "../pages/merchant/ShippingRateSetting/ShippingRateSetting";
import ReferralQrCode from "../pages/merchant/qrCode/ReferralQrCode";
import PaymentQrCode from "../pages/merchant/qrCode/PaymentQrCode";
import ShippedOrder from "../pages/merchant/orders/ShippedOrder";
import ExchangedOrder from "../pages/merchant/orders/ExchangedOrder";
import MerchantOrderDetails from "../pages/merchant/orders/MerchantOrderDetails";
import EligibleOrders from "../pages/merchant/orders/EligibleOrders";

export const merchantRoute = [
  {
    index: true,
    element: <MerchantDashboard />,
  },
  {
    path: "member-registration",
    element: <MemberRegistration />,
  },
  {
    path: "payment-qr-code",
    element: <PaymentQrCode />,
  },
  {
    path: "referral-qr-code",
    element: <ReferralQrCode />,
  },
  {
    path: "merchant-staff",
    element: <MerchantStaff />,
  },
  {
    path: "merchant-staff/create",
    element: <MerchantStaffCreate />,
  },
  {
    path: "merchant-staff/:id",
    element: <MerchantStaffDetails />,
  },
  {
    path: "merchant-staff/update/:id",
    element: <MerchantStaffUpdate />,
  },
  {
    path: "transactions/pending-approval",
    element: <PendingApproval />,
  },
  {
    path: "transactions/all-transactions",
    element: <AllTransactions />,
  },
  {
    path: "transactions/daily-transactions",
    element: <DailyTransaction />,
  },
  {
    path: "product/draft-products",
    element: <DraftProducts />,
  },
  {
    path: "product/active-products",
    element: <ActiveProducts />,
  },
  {
    path: "product/inactive-products",
    element: <InactiveProducts />,
  },
  {
    path: "product/create",
    element: <ProductForm />,
  },
  {
    path: "product/edit/:id",
    element: <ProductForm />,
  },
  {
    path: "product/view/:id",
    element: <ProductDetails />,
  },
  {
    path: "orders/pending-order",
    element: <PendingOrder />,
  },
  {
    path: "orders/complete-order",
    element: <CompleteOrder />,
  },
  {
    path: "orders/exchanged-order",
    element: <ExchangedOrder />,
  },
  {
    path: "orders/shipped-order",
    element: <ShippedOrder />,
  },
  {
    path: "orders/eligible-order",
    element: <EligibleOrders />,
  },
  {
    path: "orders/cancel-order",
    element: <CancelOrder />,
  },
  {
    path: "orders/view/:orderNumber",
    element: <MerchantOrderDetails />,
  },
  {
    path: "redeem-mall",
    element: <RedeemMall />,
  },
  {
    path: "voucher-purchase",
    element: <VoucherPurchase />,
  },
  {
    path: "add",
    element: <VoucherPurchaseForm />,
  },
  {
    path: "voucher-details/:id",
    element: <VoucherPurchaseDetails />,
  },

  {
    path: "referred-member-list",
    element: <ReferredMemberList />,
  },
  {
    path: "point-statement",
    element: <PointStatement />,
  },
  {
    path: "available-transaction",
    element: <AvailableTransaction />,
  },
  {
    path: "refer-transaction",
    element: <ReferTransaction />,
  },
  {
    path: "point-statement/:id",
    element: <TransactionDetails />,
  },
  {
    path: "reports/member-transactions",
    element: <MemberTransaction />,
  },
  {
    path: "reports/voucher-purchase",
    element: <VoucherPurchaseReport />,
  },
  {
    path: "reports/redeem-mall-transactions",
    element: <RedeemMallTransactions />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "notification",
    element: <Notification />,
  },
  {
    path: "notification/:id",
    element: <NotificationDetails />,
  },
  {
    path: "shipping-rate-settings",
    element: <ShippingRateSetting />,
  },
  {
    path: "role-permission/assign",
    element: <AssignPermissionsToRole />,
  },
  {
    path: "role-permission/role-list",
    element: <RoleList />,
  },
];
