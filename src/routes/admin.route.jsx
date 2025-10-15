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
import MerchantDetails from "../pages/admin/merchant/MerchantDetails";
import MerchantEdit from "../pages/admin/merchant/MerchantEdit";

export const adminRoutes = [
  {
    index: true,
    element: <AdminDashboard />,
  },
  {
    path: "member-manage",
    element: <MemberManage />,
  },
  {
    path: "member-registration",
    element: <MemberRegistration />,
  },
  {
    path: "member-manage/:id",
    element: <MemberDetails />,
  },
  {
    path: "staff-manage",
    element: <StaffManage />,
  },
  {
    path: "merchant/pending-merchant",
    element: <PendingMerchant />,
  },
  {
    path: "merchant/details/:id",
    element: <MerchantDetails />,
  },
  {
    path: "merchant/update/:id",
    element: <MerchantEdit />,
  },
  {
    path: "merchant/active-merchant",
    element: <ActiveMerchant />,
  },
  {
    path: "merchant/merchant-registration",
    element: <MerchantRegistrationForm />,
  },
  {
    path: "accounts/income",
    element: <Income />,
  },
  {
    path: "accounts/expense",
    element: <Expense />,
  },
  {
    path: "reports/transaction",
    element: <Transaction />,
  },
  {
    path: "reports/voucher-purchase",
    element: <VoucherPurchase />,
  },
  {
    path: "reports/member-points-report",
    element: <MemberPointsReport />,
  },
  {
    path: "reports/tree-performance",
    element: <TreePerformance />,
  },
  {
    path: "reports/redemption",
    element: <Redemption />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
];
