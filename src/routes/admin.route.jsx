import AdminDashboard from "../pages/admin/adminDashboard/AdminDashboard";
import Profile from "../pages/admin/profile/Profile";
import MemberPointsReport from "../pages/admin/reports/MemberPointsReport";
import Redemption from "../pages/admin/reports/Redemption";
import TreePerformance from "../pages/admin/reports/TreePerformance";
import VoucherPurchase from "../pages/admin/reports/VoucherPurchase";
import MemberManage from "../pages/admin/memberMange/MemberManage";
import StaffManage from "../pages/admin/staffManage/StaffManage";
import PendingMerchant from "../pages/admin/merchant/PendingMerchant";
import Income from "../pages/admin/Accounts/Income";
import Expense from "../pages/admin/Accounts/Expense";
import Transaction from "../pages/admin/reports/Transaction";
import MemberRegistration from "../pages/admin/memberMange/MemberRegistration";
import MemberDetails from "../pages/admin/memberMange/MemberDetails";
import MerchantRegistrationForm from "../pages/admin/merchant/MerchantRegistrationForm";
import MerchantDetails from "../pages/admin/merchant/MerchantDetails";
import MerchantEdit from "../pages/admin/merchant/MerchantEdit";
import StaffDetails from "../pages/admin/staffManage/StaffDetails";
import StaffUpdate from "../pages/admin/staffManage/StaffUpdate";
import CreateStaff from "../pages/admin/staffManage/CreateStaff";
import AllMerchant from "../pages/admin/merchant/AllMerchant";
import MemberUpdate from "../pages/admin/memberMange/MemberUpdate";
import CompanyInfo from "../pages/admin/CompanyInfo/CompanyInfo";
import Denomination from "../pages/admin/Denomination/Denomination";
import BusinessType from "../pages/admin/merchant/BusinessType";
import PendingMerchantDetails from "../pages/admin/merchant/PendingMerchantDetails";
import Settings from "../pages/admin/Settings/Settings";

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
    path: "member-manage/details/:id",
    element: <MemberDetails />,
  },
  {
    path: "member-manage/edit/:id",
    element: <MemberUpdate />,
  },
  {
    path: "staff-manage",
    element: <StaffManage />,
  },
  {
    path: "staff-manage/create",
    element: <CreateStaff />,
  },
  {
    path: "staff-manage/details/:id",
    element: <StaffDetails />,
  },
  {
    path: "staff-manage/update/:id",
    element: <StaffUpdate />,
  },
  {
    path: "merchant/pending-merchant",
    element: <PendingMerchant />,
  },
  {
    path: "pending-merchant/details/:id",
    element: <PendingMerchantDetails />,
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
    path: "merchant/all-merchant",
    element: <AllMerchant />,
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
    path: "merchant/business-type",
    element: <BusinessType />,
  },
  {
    path: "company-info",
    element: <CompanyInfo />,
  },
  {
    path: "denomination",
    element: <Denomination />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
];
