import Community from "../pages/member/community/Community";
import DataPrivacyPolicy from "../pages/member/dataPrivacyPolicy/DataPrivacyPolicy";
import MaxRedeemMall from "../pages/member/maxRedeemMall/MaxRedeemMall";
import MemberDashboard from "../pages/member/memberDashboard/MemberDashboard";
import MerchantApplication from "../pages/member/merchantApplication/MerchantApplication";
import PointStatement from "../pages/member/pointStatement/PointStatement";
import Profile from "../pages/member/profile/Profile";
import PurchaseVoucher from "../pages/member/purchaseVoucher/PurchaseVoucher";
import ReferNewMember from "../pages/member/referNewMember/ReferNewMember";
import ReferNewMemberForm from "../pages/member/referNewMember/ReferNewMemberForm";
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
    path: "referred-member",
    element: <ReferNewMember />,
  },
  {
    path: "refer-new-member",
    element: <ReferNewMemberForm />,
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
    path: "shop-with-merchant",
    element: <ShopWithMerchant />,
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
