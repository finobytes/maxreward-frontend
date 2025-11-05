import React, { useState } from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { UsersRound, ScrollText } from "lucide-react";
import MerchantDetailsSkeleton from "../../../components/skeleton/MerchantDetailsSkeleton";
import StaffDetailsTabs from "./components/StaffDetailsTabs";
import StaffTabContent from "./components/StaffTabContent";
import StaffProfile from "./components/StaffProfile";
import StaffInfo from "./components/StaffInfo";
import { useGetSingleAdminStaffQuery } from "../../../redux/features/admin/adminStaff/adminStaffApi";
import StaffDocuments from "./components/StaffDocuments";

const tabs = [
  { name: "Activity", icon: UsersRound, key: "activity" },
  { name: "Transactions", icon: ScrollText, key: "transactions" },
];

const StaffDetails = () => {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState("activity");

  const { data: staff, isLoading, isError } = useGetSingleAdminStaffQuery(id);

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
          Failed to load staff details.
        </div>
      ) : !staff ? (
        <div className="text-center text-gray-500 py-10">
          No staff data found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-4">
            <ComponentCard>
              <StaffProfile staff={staff?.data} />
            </ComponentCard>

            <div className="">
              <StaffInfo staff={staff?.data} />
            </div>
            <div>
              <StaffDocuments staff={staff?.data} />
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
              <StaffTabContent currentTab={currentTab} staff={staff?.data} />
            </ComponentCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDetails;
