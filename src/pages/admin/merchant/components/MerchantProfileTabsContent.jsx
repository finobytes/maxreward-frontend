import Products from "./Products";
import Staff from "./Staff";
import ReferredMember from "./ReferredMember";
import Statements from "./Statement";

const MerchantProfileTabsContent = ({ currentTab }) => {
  switch (currentTab) {
    case "products":
      return <Products />;
    case "statements":
      return <Statements />;
    case "staff":
      return <Staff />;
    case "referredMember":
      return <ReferredMember />;
    default:
      return null;
  }
};

export default MerchantProfileTabsContent;
