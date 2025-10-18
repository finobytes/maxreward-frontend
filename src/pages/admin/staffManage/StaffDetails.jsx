import React, { useState } from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { UsersRound, ScrollText } from "lucide-react";
import { useGetMemberByIdQuery } from "../../../redux/features/admin/memberManagement/memberManagementApi";
import MerchantDetailsSkeleton from "../../../components/skeleton/MerchantDetailsSkeleton";
import MemberProfile from "../memberMange/components/MemberProfile";
import PersonalInfo from "../memberMange/components/PersonalInfo";
import ActiveReferrals from "../memberMange/components/ActiveReferrals";
import TransactionActivity from "../memberMange/components/TransactionActivity";
import ProfileTabs from "../memberMange/components/ProfileTabs";
import ProfileTabContent from "../memberMange/components/ProfileTabContent";
import StaffDetailsTabs from "./components/StaffDetailsTabs";
import StaffTabContent from "./components/StaffTabContent";
import StaffProfile from "./components/StaffProfile";
import StaffInfo from "./components/StaffInfo";

const tabs = [
  { name: "Activity", icon: UsersRound, key: "activity" },
  { name: "Transactions", icon: ScrollText, key: "transactions" },
];

const StaffDetails = () => {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState("activity");

  const {
    data: member,
    isLoading,
    isError,
  } = useGetMemberByIdQuery(id, { skip: !id });
  console.log("Fetched member:", member);

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Staff Profile", to: "/admin/staff-manage" },
          { label: "Staff Profile" },
        ]}
      />

      {isLoading ? (
        <MerchantDetailsSkeleton />
      ) : isError ? (
        <div className="text-center text-red-500 py-10">
          Failed to load member details.
        </div>
      ) : !member ? (
        <div className="text-center text-gray-500 py-10">
          No member data found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-4">
            <ComponentCard>
              <StaffProfile member={member} />
            </ComponentCard>

            <div className="">
              <StaffInfo member={member} />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <ComponentCard>
              <StaffDetailsTabs
                tabs={tabs}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
              <StaffTabContent currentTab={currentTab} member={member} />
            </ComponentCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDetails;
