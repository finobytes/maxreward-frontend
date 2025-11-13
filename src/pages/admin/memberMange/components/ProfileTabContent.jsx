import CommunityTree from "./CommunityTree";
import AddPayment from "./AddPayment";
import Statements from "./Statements";
import CommunityUplink from "./CommunityUplink";

const ProfileTabContent = ({ currentTab, member }) => {
  switch (currentTab) {
    case "community":
      return <CommunityTree memberId={member?.id} />;
    case "communityUplink":
      return <CommunityUplink />;
    case "statements":
      return <Statements />;
    default:
      return null;
  }
};

export default ProfileTabContent;
