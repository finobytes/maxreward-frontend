import React from "react";
import ProductList from "./components/ProductList";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";

const ApprovedProducts = () => {
  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/merchant" },
          { label: "Products" },
          { label: "Approved Products" },
        ]}
      />
      <ProductList statusFilter="approved" title="Approved Products" />
    </div>
  );
};

export default ApprovedProducts;
