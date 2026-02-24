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

/**
 * Permission naming convention (auto-generated from Section + Action):
 *
 * For Admin guard:   admin.{section}.{action}
 * For Merchant guard: {section}.{action}
 *
 * Example Sections:  accounts, e-commerce, reports, merchant manage, member manage, etc.
 * Example Actions:   company info, denomination, voucher, category, shipping zone, etc.
 *
 * How to create:
 * 1. Section List → Create "accounts", "e-commerce", "reports", etc.
 * 2. Action List  → Create "company info", "denomination", "voucher", "category", etc.
 * 3. Permission List → Select Guard + Section + Action → auto-generates name
 *    e.g. Guard="admin", Section="accounts", Action="company info" → "admin.accounts.company info"
 * 4. Assign Permissions → Select a Role → check the permissions to assign
 */

export const NAV_CONFIG = {
  admin: [
    // Dashboard - always visible (no permission required)
    { icon: <LayoutDashboard />, name: "Dashboard", path: "/admin" },

    // Member Manage - Section: "member manage", Action: "member manage"
    {
      name: "Member Manage",
      icon: <Users />,
      path: "/admin/member-manage",
      permission: "admin.member manage.member manage",
    },

    // Staff Manage - Section: "staff manage", Action: "staff manage"
    {
      name: "Staff Manage",
      icon: <UserCog />,
      path: "/admin/staff-manage",
      permission: "admin.staff manage.staff manage",
    },

    // Merchant Manage - Section: "merchant manage"
    {
      name: "Merchant Manage",
      icon: <ShoppingBag />,
      subItems: [
        {
          name: "Pending Merchant",
          path: "/admin/merchant/pending-merchant",
          permission: "admin.merchant manage.pending merchant",
        },
        {
          name: "All Merchant",
          path: "/admin/merchant/all-merchant",
          permission: "admin.merchant manage.all merchant",
        },
        {
          name: "Business Type",
          path: "/admin/merchant/business-type",
          permission: "admin.merchant manage.business type",
        },
      ],
    },

    // E-Commerce - Section: "e-commerce"
    {
      name: "E-Commerce",
      icon: <ShoppingBasket />,
      subItems: [
        {
          name: "Category",
          path: "/admin/e-commerce/category",
          permission: "admin.e-commerce.category",
        },
        {
          name: "Sub Category",
          path: "/admin/e-commerce/sub-category",
          permission: "admin.e-commerce.sub category",
        },
        {
          name: "Brand",
          path: "/admin/e-commerce/brand",
          permission: "admin.e-commerce.brand model",
        },
        {
          name: "Model",
          path: "/admin/e-commerce/model",
          permission: "admin.e-commerce.brand model",
        },
        {
          name: "Gender",
          path: "/admin/e-commerce/gender",
          permission: "admin.e-commerce.gender",
        },
        {
          name: "Attribute",
          path: "/admin/e-commerce/attribute",
          permission: "admin.e-commerce.attribute",
        },
        {
          name: "Attribute Item",
          path: "/admin/e-commerce/attribute-item",
          permission: "admin.e-commerce.attribute item",
        },
        {
          name: "Shipping Methods",
          path: "/admin/e-commerce/shipping-methods",
          permission: "admin.e-commerce.shipping methods",
        },
        {
          name: "Shipping Zone",
          path: "/admin/e-commerce/shipping-zone",
          permission: "admin.e-commerce.shipping zone",
        },
      ],
    },

    // Accounts - Section: "accounts"
    {
      name: "Accounts",
      icon: <ChartArea />,
      subItems: [
        {
          name: "Voucher",
          path: "/admin/voucher-manage",
          permission: "admin.accounts.voucher",
        },
        {
          name: "Denomination",
          path: "/admin/denomination",
          permission: "admin.accounts.denomination",
        },
        {
          name: "Company Info",
          path: "/admin/company-info",
          permission: "admin.accounts.company info",
        },
      ],
    },

    // Reports - Section: "reports"
    {
      name: "Reports",
      icon: <ChartLine />,
      subItems: [
        {
          name: "Point Transaction",
          path: "/admin/reports/transaction",
          permission: "admin.reports.point transaction",
        },
        {
          name: "Purchase transaction",
          path: "/admin/merchant-transaction",
          permission: "admin.reports.purchase transaction",
        },
        {
          name: "CP Distribution Report",
          path: "/admin/cp-transaction",
          permission: "admin.reports.cp distribution report",
        },
        {
          name: "Memberwise CP",
          path: "/admin/community-point",
          permission: "admin.reports.memberwise cp",
        },
        {
          name: "CP Unlock History",
          path: "/admin/cp-unlock-history",
          permission: "admin.reports.cp unlock history",
        },
        {
          name: "Email Log",
          path: "/admin/reports/email-log",
          permission: "admin.reports.email log",
        },
        {
          name: "Redeem Mall Transaction",
          path: "/admin/reports/redemption",
          permission: "admin.reports.redeem mall transaction",
        },
      ],
    },

    // Notification - Section: "notification", Action: "notification"
    {
      name: "Notification",
      icon: <Bell />,
      path: "/admin/notification",
      permission: "admin.notification.notification",
    },

    // Settings - Section: "settings", Action: "settings"
    {
      name: "Settings",
      icon: <Settings />,
      path: "/admin/settings",
      permission: "admin.settings.settings",
    },

    // Role Permission - Section: "role permission", Action: "role permission"
    {
      name: "Role Permission",
      icon: <ShieldCheck />,
      subItems: [
        {
          name: "Role List",
          path: "/admin/role-permission/role-list",
          permission: "admin.role permission.role permission",
        },
        {
          name: "Permission List",
          path: "/admin/role-permission/permission-list",
          permission: "admin.role permission.role permission",
        },
        {
          name: "Assign Permissions",
          path: "/admin/role-permission/assign",
          permission: "admin.role permission.role permission",
        },
        {
          name: "Section List",
          path: "/admin/role-permission/section-list",
          permission: "admin.role permission.role permission",
        },
        {
          name: "Action List",
          path: "/admin/role-permission/action-list",
          permission: "admin.role permission.role permission",
        },
      ],
    },

    // Profile & Logout - always visible (no permission required)
    { name: "Profile", icon: <UserCircle2 />, path: "/admin/profile" },
    { name: "Logout", icon: <LogOut />, path: "/login" },
  ],

  merchant: [
    // Dashboard - always visible
    { icon: <LayoutDashboard />, name: "Dashboard", path: "/merchant" },

    // Member Registration
    {
      icon: <Users />,
      name: "Member Registration",
      path: "/merchant/member-registration",
      permission: "member registration.member registration",
    },

    // Show QR Code
    {
      icon: <QrCode />,
      name: "Show QR Code",
      subItems: [
        {
          name: "Payment QR Code",
          path: "/merchant/payment-qr-code",
          permission: "qr code.payment qr code",
        },
        {
          name: "Referral QR Code",
          path: "/merchant/referral-qr-code",
          permission: "qr code.referral qr code",
        },
      ],
    },

    // Merchant Staff
    {
      icon: <Users />,
      name: "Merchant Staff",
      path: "/merchant/merchant-staff",
      permission: "staff.merchant staff",
    },

    // Products
    {
      icon: <BoxIcon />,
      name: "Products",
      subItems: [
        {
          name: "Draft Products",
          path: "/merchant/product/draft-products",
          permission: "products.draft products",
        },
        {
          name: "Active Products",
          path: "/merchant/product/active-products",
          permission: "products.active products",
        },
        {
          name: "Inactive Products",
          path: "/merchant/product/inactive-products",
          permission: "products.inactive products",
        },
      ],
    },

    // Orders
    {
      icon: <ShoppingBag />,
      name: "Orders",
      subItems: [
        {
          name: "Pending Order",
          path: "/merchant/orders/pending-order",
          permission: "orders.pending order",
        },
        {
          name: "Complete Order",
          path: "/merchant/orders/complete-order",
          permission: "orders.complete order",
        },
        {
          name: "Exchanged Order",
          path: "/merchant/orders/exchanged-order",
          permission: "orders.exchanged order",
        },
        {
          name: "Cancel Order",
          path: "/merchant/orders/cancel-order",
          permission: "orders.cancel order",
        },
        {
          name: "Shipped Order",
          path: "/merchant/orders/shipped-order",
          permission: "orders.shipped order",
        },
        {
          name: "Eligible Order",
          path: "/merchant/orders/eligible-order",
          permission: "orders.eligible order",
        },
      ],
    },

    // Transactions
    {
      icon: <Wallet />,
      name: "Transactions",
      subItems: [
        {
          name: "Pending Approval",
          path: "/merchant/transactions/pending-approval",
          permission: "transactions.pending approval",
        },
        {
          name: "Daily Transactions",
          path: "/merchant/transactions/daily-transactions",
          permission: "transactions.daily transactions",
        },
        {
          name: "All Transactions",
          path: "/merchant/transactions/all-transactions",
          permission: "transactions.all transactions",
        },
      ],
    },

    // Notification
    {
      name: "Notification",
      icon: <Bell />,
      path: "/merchant/notification",
      permission: "notification.notification",
    },

    // Redeem Mall
    {
      icon: <ShoppingBag />,
      name: "Redeem Mall",
      path: "/merchant/redeem-mall",
      permission: "redeem mall.redeem mall",
    },

    // Voucher Purchase
    {
      icon: <DollarSign />,
      name: "Voucher Purchase",
      path: "/merchant/voucher-purchase",
      permission: "voucher purchase.voucher purchase",
    },

    // Point Statement
    {
      icon: <ChartArea />,
      name: "Point Statement",
      subItems: [
        {
          name: "Available Transaction",
          path: "/merchant/available-transaction",
          permission: "point statement.available transaction",
        },
        {
          name: "Refer Transaction",
          path: "/merchant/refer-transaction",
          permission: "point statement.refer transaction",
        },
      ],
    },

    // Referred Member List
    {
      icon: <List />,
      name: "Referred Member List",
      path: "/merchant/referred-member-list",
      permission: "member.referred member list",
    },

    // Reports
    {
      icon: <ChartLine />,
      name: "Reports",
      subItems: [
        {
          name: "Member Transactions",
          path: "/merchant/reports/member-transactions",
          permission: "reports.member transactions",
        },
        {
          name: "Voucher Purchase",
          path: "/merchant/reports/voucher-purchase",
          permission: "reports.voucher purchase",
        },
        {
          name: "Redeem Transactions",
          path: "/merchant/reports/redeem-mall-transactions",
          permission: "reports.redeem transactions",
        },
      ],
    },

    // Role Permission
    {
      name: "Role Permission",
      icon: <ShieldCheck />,
      subItems: [
        {
          name: "Role List",
          path: "/merchant/role-permission/role-list",
          permission: "role permission.role permission",
        },
        {
          name: "Assign Permissions",
          path: "/merchant/role-permission/assign",
          permission: "role permission.role permission",
        },
      ],
    },

    // Shipping Rate Settings
    {
      name: "Shipping Rate Settings",
      icon: <Settings />,
      path: "/merchant/shipping-rate-settings",
      permission: "settings.shipping rate settings",
    },

    // Profile & Logout - always visible
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
      icon: <ShoppingCart />,
      name: "My Orders",
      path: "/member/orders",
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
