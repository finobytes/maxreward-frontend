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
import Notification from "../pages/admin/Notification/Notification";
import NotificationDetails from "../pages/admin/Notification/NotificationDetails";
import VoucherManage from "../pages/admin/VoucherManage/VoucherManage";
import WhatsAppLog from "../pages/admin/reports/WhatsAppLog";
import EmailLog from "../pages/admin/reports/EmailLog";
import VoucherDetails from "../pages/admin/VoucherManage/VoucherDetails";
import ReferralList from "../pages/admin/memberMange/ReferralList";
import CpTransaction from "../pages/admin/cpTransaction/CpTransaction";
import CpTransactionDetails from "../pages/admin/cpTransaction/CpTransactionDetails";
import CpUnlockHistory from "../pages/admin/cpUnlockHistory/CpUnlockHistory";
import CpUnlockHistoryDetails from "../pages/admin/cpUnlockHistory/CpUnlockHistoryDetails";
import CommunityPoint from "../pages/admin/communityPoint/CommunityPoint";
import CommunityPointDetails from "../pages/admin/communityPoint/CommunityPointDetails";
import MerchantTransaction from "../pages/admin/Transaction/MerchanTransaction";
import MerchantTransactionDetails from "../pages/admin/Transaction/MerchantTransactionDetails";
import CPLevel from "../pages/admin/Settings/CPLevel";
import Category from "../pages/admin/e-commerce/Category/Category";
import SubCategory from "../pages/admin/e-commerce/SubCategory/SubCategory";
import Brand from "../pages/admin/e-commerce/Brand/Brand";
import Model from "../pages/admin/e-commerce/Model/Model";
import Gender from "../pages/admin/e-commerce/Gender/Gender";
import Attribute from "../pages/admin/e-commerce/Attribute/Attribute";
import AttributeItem from "../pages/admin/e-commerce/AttributeItem/AttributeItem";
import RoleList from "../pages/admin/rolePermission/RoleList";
import PermissionList from "../pages/admin/rolePermission/PermissionList";
import SectionList from "../pages/admin/rolePermission/SectionList";
import ActionList from "../pages/admin/rolePermission/ActionList";

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
    path: "member-manage/referrals/:id",
    element: <ReferralList />,
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
    path: "e-commerce/category",
    element: <Category />,
  },
  {
    path: "e-commerce/sub-category",
    element: <SubCategory />,
  },
  {
    path: "e-commerce/brand",
    element: <Brand />,
  },
  {
    path: "e-commerce/model",
    element: <Model />,
  },
  {
    path: "e-commerce/gender",
    element: <Gender />,
  },
  {
    path: "e-commerce/attribute",
    element: <Attribute />,
  },
  {
    path: "e-commerce/attribute-item",
    element: <AttributeItem />,
  },
  {
    path: "cp-transaction",
    element: <CpTransaction />,
  },
  {
    path: "cp-transaction/:id",
    element: <CpTransactionDetails />,
  },
  {
    path: "cp-unlock-history",
    element: <CpUnlockHistory />,
  },
  {
    path: "cp-unlock-history/:id",
    element: <CpUnlockHistoryDetails />,
  },
  {
    path: "community-point",
    element: <CommunityPoint />,
  },
  {
    path: "community-point/details/:memberId",
    element: <CommunityPointDetails />,
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
    path: "voucher-manage",
    element: <VoucherManage />,
  },
  {
    path: "vouchers/:id",
    element: <VoucherDetails />,
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
    path: "reports/whatsapp-log",
    element: <WhatsAppLog />,
  },
  {
    path: "reports/email-log",
    element: <EmailLog />,
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
    path: "merchant-transaction",
    element: <MerchantTransaction />,
  },

  {
    path: "merchant-transaction/:id",
    element: <MerchantTransactionDetails />,
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
    path: "notification",
    element: <Notification />,
  },
  {
    path: "notification/:id",
    element: <NotificationDetails />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
  {
    path: "cp-level",
    element: <CPLevel />,
  },
  {
    path: "role-permission/role-list",
    element: <RoleList />,
  },
  {
    path: "role-permission/permission-list",
    element: <PermissionList />,
  },
  {
    path: "role-permission/section-list",
    element: <SectionList />,
  },
  {
    path: "role-permission/action-list",
    element: <ActionList />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
];
