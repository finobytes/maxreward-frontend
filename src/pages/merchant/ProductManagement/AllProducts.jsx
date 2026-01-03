import React from "react";
import ProductList from "./components/ProductList";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";

const AllProducts = () => {
  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/merchant" },
          { label: "Products" },
          { label: "All Products" },
        ]}
      />
      <ProductList statusFilter="" title="All Products" />
    </div>
  );
};

export default AllProducts;
