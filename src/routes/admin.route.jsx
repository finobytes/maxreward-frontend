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

export const adminRoutes = [
  {
    path: "/admin",
    component: <AdminDashboard />,
  },
  {
    path: "member-manage",
    component: <MemberManage />,
  },
  {
    path: "staff-manage",
    component: <StaffManage />,
  },
  {
    path: "merchant/pending-merchant",
    component: <PendingMerchant />,
  },
  {
    path: "merchant/active-merchant",
    component: <ActiveMerchant />,
  },
  {
    path: "accounts/income",
    component: <Income />,
  },
  {
    path: "accounts/expense",
    component: <Expense />,
  },
  {
    path: "reports/transaction",
    component: <Transaction />,
  },
  {
    path: "reports/voucher-purchase",
    component: <VoucherPurchase />,
  },
  {
    path: "reports/member-points-report",
    component: <MemberPointsReport />,
  },
  {
    path: "reports/tree-performance",
    component: <TreePerformance />,
  },
  {
    path: "reports/redemption",
    component: <Redemption />,
  },
  {
    path: "profile",
    component: <Profile />,
  },
];
