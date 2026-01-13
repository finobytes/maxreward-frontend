import React from "react";
import ProductList from "./components/ProductList";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";

const InactiveProducts = () => {
  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/merchant" },
          { label: "Products" },
          { label: "Inactive Products" },
        ]}
      />
      <ProductList statusFilter="inactive" title="Inactive Products" />
    </div>
  );
};

export default InactiveProducts;
