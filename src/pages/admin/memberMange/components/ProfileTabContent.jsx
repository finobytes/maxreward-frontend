import CommunityTree from "./CommunityTree";
import AddPayment from "./AddPayment";
import Statements from "./Statements";
import CommunityUplink from "./CommunityUplink";

const ProfileTabContent = ({ currentTab, member }) => {
  switch (currentTab) {
    case "statements":
      return <Statements member={member} />;
    case "community":
      return <CommunityTree memberId={member?.id} />;
    case "communityUplink":
      return <CommunityUplink member={member} />;
    default:
      return null;
  }
};

export default ProfileTabContent;
