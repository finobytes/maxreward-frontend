import React, { useState } from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import MemberProfile from "./components/MemberProfile";
import PersonalInfo from "./components/PersonalInfo";
import ActiveReferrals from "./components/ActiveReferrals";
import TransactionActivity from "./components/TransactionActivity";
import ProfileTabs from "./components/ProfileTabs";
import ProfileTabContent from "./components/ProfileTabContent";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersRound, ScrollText } from "lucide-react";
import { useGetMemberByIdQuery } from "../../../redux/features/admin/memberManagement/memberManagementApi";

const tabs = [
  { name: "Community", icon: UsersRound, key: "community" },
  { name: "Statements", icon: ScrollText, key: "statements" },
];

const MemberDetails = () => {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState("community");

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
          { label: "Member Manage", to: "/admin/member-manage" },
          { label: "Member Profile" },
        ]}
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
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
              <MemberProfile member={member} />
            </ComponentCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <PersonalInfo member={member} />
              </div>
              <div>
                <ActiveReferrals memberId={member.id} />
              </div>
            </div>

            <TransactionActivity memberId={member.id} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <ComponentCard>
              <ProfileTabs
                tabs={tabs}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
              <ProfileTabContent currentTab={currentTab} member={member} />
            </ComponentCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetails;
