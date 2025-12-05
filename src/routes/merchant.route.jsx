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
];
