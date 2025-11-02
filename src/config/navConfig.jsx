import {
  ChartArea,
  ChartLine,
  CircleUserRound,
  DollarSign,
  FileUser,
  LayoutDashboard,
  List,
  LogOut,
  QrCode,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  UserCircle2,
  UserCog,
  Users,
  Building,
  Settings,
  Bell,
  TicketCheck,
} from "lucide-react";

export const NAV_CONFIG = {
  admin: [
    { icon: <LayoutDashboard />, name: "Dashboard", path: "/admin" },
    { name: "Member Manage", icon: <Users />, path: "/admin/member-manage" },
    { name: "Staff Manage", icon: <UserCog />, path: "/admin/staff-manage" },
    {
      name: "Merchant Manage",
      icon: <ShoppingBag />,
      subItems: [
        {
          name: "Pending Merchant",
          path: "/admin/merchant/pending-merchant",
        },
        { name: "All Merchant", path: "/admin/merchant/all-merchant" },
        {
          name: "Business Type",
          path: "/admin/merchant/business-type",
        },
      ],
    },
    {
      name: "Voucher Manage",
      icon: <TicketCheck />,
      path: "/admin/voucher-manage",
    },
    {
      name: "Accounts",
      icon: <ChartArea />,
      subItems: [
        { name: "Income", path: "/admin/accounts/income" },
        { name: "Expense", path: "/admin/accounts/expense" },
      ],
    },
    {
      name: "Reports",
      icon: <ChartLine />,
      subItems: [
        { name: "Transaction", path: "/admin/reports/transaction" },
        { name: "WhatsApp Log", path: "/admin/reports/whatsapp-log" },
        {
          name: "Point Statement",
          path: "/admin/reports/member-points-report",
        },
        { name: "Tree Performance", path: "/admin/reports/tree-performance" },
        { name: "Redeem Mall Transaction", path: "/admin/reports/redemption" },
      ],
    },
    {
      name: "Company Info",
      icon: <Building />,
      path: "/admin/company-info",
    },
    {
      name: "Denomination",
      icon: <DollarSign />,
      path: "/admin/denomination",
    },
    {
      name: "Notification",
      icon: <Bell />,
      path: "/admin/notification",
    },
    {
      name: "Settings",
      icon: <Settings />,
      path: "/admin/settings",
    },
    { name: "Profile", icon: <UserCircle2 />, path: "/admin/profile" },
    { name: "Logout", icon: <LogOut />, path: "/login" },
  ],
  merchant: [
    { icon: <LayoutDashboard />, name: "Dashboard", path: "/merchant" },
    {
      icon: <Users />,
      name: "Member Registration",
      path: "/merchant/member-registration",
    },
    {
      icon: <Users />,
      name: "Merchant Staff",
      path: "/merchant/merchant-staff",
    },
    {
      icon: <ChartArea />,
      name: "Transactions",
      subItems: [
        {
          name: "Pending Approval",
          path: "/merchant/transactions/pending-approval",
        },
        {
          name: "Approved Transactions",
          path: "/merchant/transactions/approved-transactions",
        },
      ],
    },
    {
      icon: <ShoppingBag />,
      name: "Redeem Mall",
      path: "/merchant/redeem-mall",
    },
    {
      icon: <ChartArea />,
      name: "Voucher Purchase",
      path: "/merchant/voucher-purchase",
    },
    {
      icon: <ChartLine />,
      name: "Reports",
      subItems: [
        {
          name: "Member Transactions",
          path: "/merchant/reports/member-transactions",
        },
        {
          name: "Voucher Purchase",
          path: "/merchant/reports/voucher-purchase",
        },
        {
          name: "Redeem Transactions",
          path: "/merchant/reports/redeem-mall-transactions",
        },
      ],
    },
    { icon: <CircleUserRound />, name: "Profile", path: "/merchant/profile" },

    { name: "Logout", icon: <LogOut />, path: "/login" },
  ],
  member: [
    { icon: <LayoutDashboard />, name: "Dashboard", path: "/member" },
    {
      icon: <Users />,
      name: "Refer New Member",
      path: "/member/referred-member",
    },
    {
      icon: <QrCode />,
      name: "Show QR Code",
      path: "/member/show-qr-code",
    },
    {
      icon: <ChartArea />,
      name: "Point Statement",
      path: "/member/point-statement",
    },
    {
      icon: <ShoppingBag />,
      name: "Max Redeem Mall",
      path: "/member/max-redeem-mall",
    },
    {
      icon: <DollarSign />,
      name: "Purchase Voucher",
      path: "/member/purchase-voucher",
    },
    {
      icon: <ShoppingCart />,
      name: "Shop With Merchant",
      path: "/member/shop-with-merchant",
    },
    {
      icon: <List />,
      name: "Referred Member List",
      path: "/member/referred-member-list",
    },
    { icon: <UserCog />, name: "Community", path: "/member/community" },
    {
      icon: <FileUser />,
      name: "Merchant Application",
      path: "/member/merchant-application",
    },
    { icon: <CircleUserRound />, name: "Profile", path: "/member/profile" },
    {
      icon: <ScrollText />,
      name: "Terms & Condition",
      path: "/member/terms-and-condition",
    },
    {
      icon: <ShieldCheck />,
      name: "Data Privacy Policy",
      path: "/member/data-privacy-policy",
    },

    { name: "Logout", icon: <LogOut /> },
  ],
};
