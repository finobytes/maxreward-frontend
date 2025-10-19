import Activity from "./Activity";
import Transaction from "./Transaction";

const StaffTabContent = ({ currentTab }) => {
  switch (currentTab) {
    case "activity":
      return <Activity />;
    case "transactions":
      return <Transaction />;
    default:
      return null;
  }
};

export default StaffTabContent;
