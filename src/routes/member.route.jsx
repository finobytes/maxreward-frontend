import Community from "../pages/member/community/Community";
import DataPrivacyPolicy from "../pages/member/dataPrivacyPolicy/DataPrivacyPolicy";
import MaxRedeemMall from "../pages/member/maxRedeemMall/MaxRedeemMall";
import MemberDashboard from "../pages/member/memberDashboard/MemberDashboard";
import MerchantApplication from "../pages/member/merchantApplication/MerchantApplication";
import PointStatement from "../pages/member/pointStatement/PointStatement";
import Profile from "../pages/member/profile/Profile";
import PurchaseVoucher from "../pages/member/purchaseVoucher/PurchaseVoucher";
import ReferNewMember from "../pages/member/referNewMember/ReferNewMember";
import ReferredMemberList from "../pages/member/referredMemberList/ReferredMemberList";
import ShopWithMerchant from "../pages/member/shopWithMerchant/ShopWithMerchant";
import ShowQrCode from "../pages/member/showQrCode/ShowQrCode";
import TermsAndConditions from "../pages/member/termsAndConditions/TermsAndConditions";

export const memberRoutes = [
  {
    index: true,
    element: <MemberDashboard />,
  },
  {
    path: "member/refer-new-member",
    element: <ReferNewMember />,
  },
  {
    path: "member/show-qr-code",
    element: <ShowQrCode />,
  },
  {
    path: "member/point-statement",
    element: <PointStatement />,
  },
  {
    path: "member/max-redeem-mall",
    element: <MaxRedeemMall />,
  },
  {
    path: "member/purchase-voucher",
    element: <PurchaseVoucher />,
  },
  {
    path: "member/shop-with-merchant",
    element: <ShopWithMerchant />,
  },
  {
    path: "member/referred-member-list",
    element: <ReferredMemberList />,
  },
  {
    path: "member/community",
    element: <Community />,
  },
  {
    path: "member/merchant-application",
    element: <MerchantApplication />,
  },
  {
    path: "member/profile",
    element: <Profile />,
  },
  {
    path: "member/Terms-and-condition",
    element: <TermsAndConditions />,
  },
  {
    path: "member/data-privacy-policy",
    element: <DataPrivacyPolicy />,
  },
];
