import AdminDashboard from "../pages/admin/adminDashboard/AdminDashboard";
import Profile from "../pages/admin/profile/Profile";
import MemberPointsReport from "../pages/admin/reports/MemberPointsReport";
import Redemption from "../pages/admin/reports/Redemption";
import TreePerformance from "../pages/admin/reports/TreePerformance";
import VoucherPurchase from "../pages/admin/reports/VoucherPurchase";
import MemberManage from "../pages/admin/memberMange/MemberManage";
import StaffManage from "../pages/admin/staffManage/StaffManage";
import PendingMerchant from "../pages/admin/merchant/PendingMerchant";
import ActiveMerchant from "../pages/admin/merchant/ActiveMerchant";
import Income from "../pages/admin/Accounts/Income";
import Expense from "../pages/admin/Accounts/Expense";
import Transaction from "../pages/admin/reports/Transaction";
import MemberRegistration from "../pages/admin/memberMange/MemberRegistration";
import MemberDetails from "../pages/admin/memberMange/MemberDetails";
import MerchantRegistrationForm from "../pages/admin/merchant/MerchantRegistrationForm";

export const adminRoutes = [
  {
    index: true,
    element: <AdminDashboard />,
  },
  {
    path: "admin/member-manage",
    element: <MemberManage />,
  },
  {
    path: "admin/member-registration",
    element: <MemberRegistration />,
  },
  {
    path: "admin/member-details",
    element: <MemberDetails />,
  },
  {
    path: "admin/staff-manage",
    element: <StaffManage />,
  },
  {
    path: "admin/merchant/pending-merchant",
    element: <PendingMerchant />,
  },
  {
    path: "admin/merchant/active-merchant",
    element: <ActiveMerchant />,
  },
  {
    path: "admin/merchant/merchant-registration",
    element: <MerchantRegistrationForm />,
  },
  {
    path: "admin/accounts/income",
    element: <Income />,
  },
  {
    path: "admin/accounts/expense",
    element: <Expense />,
  },
  {
    path: "admin/reports/transaction",
    element: <Transaction />,
  },
  {
    path: "admin/reports/voucher-purchase",
    element: <VoucherPurchase />,
  },
  {
    path: "admin/reports/member-points-report",
    element: <MemberPointsReport />,
  },
  {
    path: "admin/reports/tree-performance",
    element: <TreePerformance />,
  },
  {
    path: "admin/reports/redemption",
    element: <Redemption />,
  },
  {
    path: "admin/profile",
    element: <Profile />,
  },
];
