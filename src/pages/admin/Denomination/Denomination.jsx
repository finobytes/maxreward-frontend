import React from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";

const Denomination = () => {
  return (
    <div className="">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Denomination" }]}
      />
      <ComponentCard
        title="Denomination details"
        className="h-screen"
      ></ComponentCard>
    </div>
  );
};

export default Denomination;
