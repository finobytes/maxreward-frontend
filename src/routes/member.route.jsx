import Community from "../pages/member/community/Community";
import CpTransaction from "../pages/member/cpTransaction/CpTransaction";
import CpUnlockHistory from "../pages/member/cpUnlockHistory/CpUnlockHistory";
import CpUnlockHistoryDetails from "../pages/member/cpUnlockHistory/CpUnlockHistoryDetails";
import CommunityPoint from "../pages/member/communityPoint/CommunityPoint";
import DataPrivacyPolicy from "../pages/member/dataPrivacyPolicy/DataPrivacyPolicy";
import MaxRedeemMall from "../pages/member/maxRedeemMall/MaxRedeemMall";
import ProductDetailsPage from "../pages/member/maxRedeemMall/ProductDetailsPage";
import CartPage from "../pages/member/maxRedeemMall/CartPage";
import MemberDashboard from "../pages/member/memberDashboard/MemberDashboard";
import MerchantApplication from "../pages/member/merchantApplication/MerchantApplication";
import AvailableTransaction from "../pages/member/pointStatement/Available/AvailableTransaction";
import ReferTransaction from "../pages/member/pointStatement/Refer/ReferTransaction";
import TransactionDetails from "../pages/member/pointStatement/TransactionDetails";
import Profile from "../pages/member/profile/Profile";
import PurchaseVoucher from "../pages/member/purchaseVoucher/PurchaseVoucher";
import VoucherDetailsForMember from "../pages/member/purchaseVoucher/VoucherDetailsForMember";
import VoucherForm from "../pages/member/purchaseVoucher/VoucherFrom";
import ReferNewMember from "../pages/member/referNewMember/ReferNewMember";
import ReferredMemberList from "../pages/member/referredMemberList/ReferredMemberList";
import RedeemTransactions from "../pages/member/shopWithMerchant/RedeemTransactions";
import RedeemWithMerchant from "../pages/member/shopWithMerchant/RedeemWithMerchant";
import ShopWithMerchant from "../pages/member/shopWithMerchant/ShopWithMerchant";
import ShowQrCode from "../pages/member/showQrCode/ShowQrCode";
import TermsAndConditions from "../pages/member/termsAndConditions/TermsAndConditions";
import Notification from "../pages/member/notification/Notification";
import NotificationDetails from "../pages/member/notification/NotificationDetails";
import Orders from "../pages/member/myOrders/Orders";
import OrderDetails from "../pages/member/myOrders/OrderDetails";

export const memberRoutes = [
  {
    index: true,
    element: <MemberDashboard />,
  },
  {
    path: "referred-member",
    element: <ReferNewMember />,
  },
  {
    path: "show-qr-code",
    element: <ShowQrCode />,
  },
  // {
  //   path: "point-statement",
  //   element: <PointStatement />,
  // },
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
    path: "cp-transaction",
    element: <CpTransaction />,
  },
  {
    path: "cp-transaction/:id",
    element: <TransactionDetails />,
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
    path: "max-redeem-mall",
    element: <MaxRedeemMall />,
  },
  {
    path: "max-redeem-mall/cart",
    element: <CartPage />,
  },
  {
    path: "max-redeem-mall/:id",
    element: <ProductDetailsPage />,
  },
  {
    path: "purchase-voucher",
    element: <PurchaseVoucher />,
  },
  {
    path: "voucher-details/:id",
    element: <VoucherDetailsForMember />,
  },
  {
    path: "add",
    element: <VoucherForm />,
  },
  {
    path: "shop-with-merchant",
    element: <ShopWithMerchant />,
  },
  {
    path: "redeem-with-merchant",
    element: <RedeemWithMerchant />,
  },
  {
    path: "redeem-transactions",
    element: <RedeemTransactions />,
  },
  {
    path: "orders",
    element: <Orders />,
  },
  {
    path: "orders/:orderNumber",
    element: <OrderDetails />,
  },
  {
    path: "referred-member-list",
    element: <ReferredMemberList />,
  },
  {
    path: "community",
    element: <Community />,
  },
  {
    path: "merchant-application",
    element: <MerchantApplication />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "Terms-and-condition",
    element: <TermsAndConditions />,
  },
  {
    path: "data-privacy-policy",
    element: <DataPrivacyPolicy />,
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
