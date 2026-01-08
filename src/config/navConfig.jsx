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
  Send,
  BanknoteArrowDown,
  History,
  Wallet,
  ShoppingBasket,
  BoxIcon,
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
      name: "E-Commerce",
      icon: <ShoppingBasket />,
      subItems: [
        {
          name: "Category",
          path: "/admin/e-commerce/category",
        },
        { name: "Sub Category", path: "/admin/e-commerce/sub-category" },
        { name: "Brand", path: "/admin/e-commerce/brand" },
        { name: "Model", path: "/admin/e-commerce/model" },
        { name: "Gender", path: "/admin/e-commerce/gender" },
        { name: "Attribute", path: "/admin/e-commerce/attribute" },
        { name: "Attribute Item", path: "/admin/e-commerce/attribute-item" },
      ],
    },
    {
      name: "Accounts",
      icon: <ChartArea />,
      subItems: [
        { name: "Voucher", path: "/admin/voucher-manage" },
        {
          name: "Denomination",
          path: "/admin/denomination",
        },
        { name: "Company Info", path: "/admin/company-info" },
        { name: "Income", path: "/admin/accounts/income" },
        { name: "Expense", path: "/admin/accounts/expense" },
      ],
    },
    {
      name: "Reports",
      icon: <ChartLine />,
      subItems: [
        // { name: "WhatsApp Log", path: "/admin/reports/whatsapp-log" },
        {
          name: "Point Transaction",
          path: "/admin/reports/transaction",
        },
        { name: "Purchase transaction", path: "/admin/merchant-transaction" },
        {
          name: "CP Distribution Report",
          path: "/admin/cp-transaction",
        },
        {
          name: "Memberwise CP",
          path: "/admin/community-point",
        },
        {
          name: "CP Unlock History",
          path: "/admin/cp-unlock-history",
        },
        { name: "Email Log", path: "/admin/reports/email-log" },
        { name: "Redeem Mall Transaction", path: "/admin/reports/redemption" },
      ],
    },
    // {
    //   name: "CP History",
    //   icon: <History />,
    //   subItems: [
    //     {
    //       name: "CP Transaction",
    //       path: "/admin/cp-transaction",
    //     },
    //     {
    //       name: "Member Community Point",
    //       path: "/admin/community-point",
    //     },
    //     {
    //       name: "CP Unlock History",
    //       path: "/admin/cp-unlock-history",
    //     },
    //   ],
    // },

    // {
    //   name: "Transaction",
    //   icon: <Wallet />,
    //   subItems: [
    //     { name: "Transaction", path: "/admin/reports/transaction" },
    //     { name: "Merchants transaction", path: "/admin/merchant-transaction" },
    //   ],
    // },
    // {
    //   name: "Denomination",
    //   icon: <DollarSign />,
    //   path: "/admin/denomination",
    // },
    {
      name: "Notification",
      icon: <Bell />,
      path: "/admin/notification",
    },
    {
      name: "Settings",
      icon: <Settings />,
      subItems: [
        { name: "Point", path: "/admin/settings" },
        { name: "CP Level", path: "/admin/cp-level" },
      ],
    },
    {
      name: "Role Permission",
      icon: <ShieldCheck />,
      subItems: [
        { name: "Role List", path: "/admin/role-permission/role-list" },
      ],
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
      icon: <BoxIcon />,
      name: "Products",
      subItems: [
        {
          name: "Draft Products",
          path: "/merchant/product/draft-products",
        },
        {
          name: "Active Products",
          path: "/merchant/product/active-products",
        },
      ],
    },
    {
      icon: <Wallet />,
      name: "Transactions",
      subItems: [
        {
          name: "Pending Approval",
          path: "/merchant/transactions/pending-approval",
        },
        {
          name: "Daily Transactions",
          path: "/merchant/transactions/daily-transactions",
        },
        {
          name: "All Transactions",
          path: "/merchant/transactions/all-transactions",
        },
      ],
    },
    {
      name: "Notification",
      icon: <Bell />,
      path: "/merchant/notification",
    },
    {
      icon: <ShoppingBag />,
      name: "Redeem Mall",
      path: "/merchant/redeem-mall",
    },
    {
      icon: <DollarSign />,
      name: "Voucher Purchase",
      path: "/merchant/voucher-purchase",
    },
    {
      icon: <ChartArea />,
      name: "Point Statement",

      subItems: [
        // {
        //   name: "Point Statement",
        //   path: "/merchant/point-statement",
        // },
        {
          name: "Available Transaction",
          path: "/merchant/available-transaction",
        },
        {
          name: "Refer Transaction",
          path: "/merchant/refer-transaction",
        },
      ],
    },
    {
      icon: <List />,
      name: "Referred Member List",
      path: "/merchant/referred-member-list",
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
      subItems: [
        {
          name: "Available Transaction",
          path: "/member/available-transaction",
        },
        {
          name: "Refer Transaction",
          path: "/member/refer-transaction",
        },
      ],
    },
    {
      icon: <ChartArea />,
      name: "CP Transaction",
      path: "/member/cp-transaction",
    },
    {
      icon: <ChartArea />,
      name: "CP Unlock History",
      path: "/member/cp-unlock-history",
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
      name: "Shop At Merchant",
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
      name: "Notification",
      icon: <Bell />,
      path: "/member/notification",
    },
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
