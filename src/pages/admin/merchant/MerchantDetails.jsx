import React, { useState } from "react";
import { BanknoteArrowUp, ScrollText, UsersRound } from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PersonalInfo from "../memberMange/components/PersonalInfo";
import ActiveReferrals from "../memberMange/components/ActiveReferrals";
import TransactionActivity from "../memberMange/components/TransactionActivity";
import ProfileTabs from "../memberMange/components/ProfileTabs";
import ProfileTabContent from "../memberMange/components/ProfileTabContent";
import MerchantProfileCard from "./components/MerchantProfileCard";
import OwnerInformation from "./components/OwnerInformation";
import TopSellingProducts from "./components/TopSellingProducts";

const tabs = [
  { name: "Community", icon: UsersRound, key: "community" },
  { name: "Statements", icon: ScrollText, key: "statements" },
];
const MerchantDetails = () => {
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
        <div className="space-y-4">
          {/* Profile Card */}
          <ComponentCard>
            <MerchantProfileCard />
          </ComponentCard>

          {/* Owner Info  */}
          <div>
            <OwnerInformation />
          </div>

          {/* Transaction Activity */}
          <div>
            <TopSellingProducts />
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

export default MerchantDetails;
