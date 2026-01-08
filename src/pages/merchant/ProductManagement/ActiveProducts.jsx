import React from "react";
import ProductList from "./components/ProductList";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";

const ActiveProducts = () => {
  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/merchant" },
          { label: "Products" },
          { label: "Active Products" },
        ]}
      />
      <ProductList statusFilter="active" title="Active Products" />
    </div>
  );
};

export default ActiveProducts;
