import React from "react";
import ProductList from "./components/ProductList";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";

const DraftProducts = () => {
  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/merchant" },
          { label: "Products" },
          { label: "Draft Products" },
        ]}
      />
      <ProductList statusFilter="draft" title="Draft Products" />
    </div>
  );
};

export default DraftProducts;
