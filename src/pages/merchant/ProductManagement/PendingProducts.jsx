import React from "react";
import ProductList from "./components/ProductList";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";

const PendingProducts = () => {
  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/merchant" },
          { label: "Products" },
          { label: "Pending Products" },
        ]}
      />
      <ProductList statusFilter="pending" title="Pending Products" />
    </div>
  );
};

export default PendingProducts;
