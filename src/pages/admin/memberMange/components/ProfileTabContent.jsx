import CommunityTree from "./CommunityTree";
import AddPayment from "./AddPayment";
import Statements from "./Statements";

const ProfileTabContent = ({ currentTab }) => {
  switch (currentTab) {
    case "community":
      return <CommunityTree />;
    case "payment":
      return <AddPayment />;
    case "statements":
      return <Statements />;
    default:
      return null;
  }
};

export default ProfileTabContent;
