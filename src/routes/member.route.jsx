import Community from "../pages/member/community/Community";
import DataPrivacyPolicy from "../pages/member/dataPrivacyPolicy/DataPrivacyPolicy";
import MaxRedeemMall from "../pages/member/maxRedeemMall/MaxRedeemMall";
import MemberDashboard from "../pages/member/memberDashboard/MemberDashboard";
import MerchantApplication from "../pages/member/merchantApplication/MerchantApplication";
import PointStatement from "../pages/member/pointStatement/PointStatement";
import Profile from "../pages/member/profile/Profile";
import PurchaseVoucher from "../pages/member/purchaseVoucher/PurchaseVoucher";
import VoucherForm from "../pages/member/purchaseVoucher/VoucherFrom";
import ReferNewMember from "../pages/member/referNewMember/ReferNewMember";
import ReferredMemberList from "../pages/member/referredMemberList/ReferredMemberList";
import RedeemTransactions from "../pages/member/shopWithMerchant/RedeemTransactions";
import RedeemWithMerchant from "../pages/member/shopWithMerchant/RedeemWithMerchant";
import ShopWithMerchant from "../pages/member/shopWithMerchant/ShopWithMerchant";
import ShowQrCode from "../pages/member/showQrCode/ShowQrCode";
import TermsAndConditions from "../pages/member/termsAndConditions/TermsAndConditions";

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
  {
    path: "point-statement",
    element: <PointStatement />,
  },
  {
    path: "max-redeem-mall",
    element: <MaxRedeemMall />,
  },
  {
    path: "purchase-voucher",
    element: <PurchaseVoucher />,
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
];
