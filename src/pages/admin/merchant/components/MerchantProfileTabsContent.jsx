import Products from "./Products";
import Staff from "./Staff";
import ReferredMember from "./ReferredMember";
import Statements from "./Statement";

const MerchantProfileTabsContent = ({ currentTab, merchantData }) => {
  switch (currentTab) {
    case "products":
      return <Products />;
    case "statements":
      return <Statements merchantData={merchantData} />;
    case "staff":
      return <Staff staffData={merchantData?.data?.staffs} />;
    case "referredMember":
      return (
        <ReferredMember
          referredMemberData={merchantData?.data?.referred_members}
        />
      );
    default:
      return null;
  }
};

export default MerchantProfileTabsContent;
