import React from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";

const CompanyInfo = () => {
  return (
    <div className="">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Company Info" }]}
      />
      <ComponentCard
        title="Company details"
        className="h-screen"
      ></ComponentCard>
    </div>
  );
};

export default CompanyInfo;
