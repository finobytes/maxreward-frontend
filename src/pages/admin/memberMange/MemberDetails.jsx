import React from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import MemberProfile from "./components/MemberProfile";
import PersonalInfo from "./components/PersonalInfo";
import ActiveReferrals from "./components/ActiveReferrals";
import TransactionActivity from "./components/TransactionActivity";

const MemberDetails = () => {
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
          <ComponentCard>{/* Manual Payment Form Component */}</ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
