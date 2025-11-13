import React, { useState } from "react";
import { ScrollText, UsersRound, BoxIcon, UserSquare2 } from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import MerchantProfileCard from "./components/MerchantProfileCard";
import BusinessInformation from "./components/BusinessInformation";
import TopSellingProducts from "./components/TopSellingProducts";
import MerchantProfileTabs from "./components/MerchantProfileTabs";
import MerchantProfileTabsContent from "./components/MerchantProfileTabsContent";
import { useGetMerchantByIdQuery } from "../../../redux/features/admin/merchantManagement/merchantManagementApi";
import { useParams } from "react-router";
import MerchantDetailsSkeleton from "../../../components/skeleton/MerchantDetailsSkeleton";
import AuthorizedPersonInformation from "./components/AuthorizedPersonInformation";

const tabs = [
  // { name: "Products", icon: BoxIcon, key: "products" },
  { name: "Statement", icon: ScrollText, key: "statements" },
  { name: "Staff", icon: UserSquare2, key: "staff" },
  { name: "Referred Member", icon: UsersRound, key: "referredMember" },
];
const MerchantDetails = () => {
  const [currentTab, setCurrentTab] = useState("statements");
  const { id } = useParams();
  const { data, isLoading } = useGetMerchantByIdQuery(id);
  console.log("Merchant Data:", data?.data);
  if (isLoading) return <MerchantDetailsSkeleton />;
  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Merchant Manage", to: "/admin/merchant/all-merchant" },
          { label: "Merchant Profile" },
        ]}
      />

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Profile Card */}
          <ComponentCard>
            <MerchantProfileCard merchant={data?.data} />
          </ComponentCard>

          {/* Owner Info  */}
          <div>
            <BusinessInformation merchantData={data?.data} />
          </div>

          <div>
            <AuthorizedPersonInformation merchantData={data?.data} />
          </div>

          {/* Transaction Activity */}
          {/* <div>
            <TopSellingProducts />
          </div> */}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <ComponentCard>
            <MerchantProfileTabs
              tabs={tabs}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
            <div className="">
              <MerchantProfileTabsContent currentTab={currentTab} />
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default MerchantDetails;
