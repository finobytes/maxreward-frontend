import React, { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import MemberProfile from "./components/MemberProfile";
import PersonalInfo from "./components/PersonalInfo";
import ActiveReferrals from "./components/ActiveReferrals";
import TransactionActivity from "./components/TransactionActivity";
import ProfileTabs from "./components/ProfileTabs";
import CommunityTree from "./components/CommunityTree";
import AddPayment from "./components/AddPayment";
import Statements from "./components/Statements";
import { BanknoteArrowUp, ScrollText, UsersRound } from "lucide-react";
import ProfileTabContent from "./components/ProfileTabContent";

const tabs = [
  { name: "Community", icon: UsersRound, key: "community" },
  { name: "Add Payment", icon: BanknoteArrowUp, key: "payment" },
  { name: "Statements", icon: ScrollText, key: "statements" },
];
const MemberDetails = () => {
  const [currentTab, setCurrentTab] = useState("community");
  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Member Manage", to: "/admin/member-manage" },
          { label: "Member Profile" },
        ]}
      />

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-4">
          {/* Profile Card */}
          <ComponentCard>
            <MemberProfile />
          </ComponentCard>

          {/* Personal Info + Active Referrals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <PersonalInfo />
            </div>
            <div>
              <ActiveReferrals />
            </div>
          </div>

          {/* Transaction Activity */}
          <div>
            <TransactionActivity />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <ComponentCard>
            <ProfileTabs
              tabs={tabs}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
            <div className="">
              <ProfileTabContent currentTab={currentTab} />
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
