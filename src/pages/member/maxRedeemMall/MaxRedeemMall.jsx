import React, { useState } from "react";
import MOCK_PRODUCTS from "./MockProducts";
import ProductCard from "./components/ProductCard";
import { Filter, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import PrimaryButton from "../../../components/ui/PrimaryButton";

const MaxRedeemMall = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories for filter
  const categories = [
    "All",
    ...new Set(MOCK_PRODUCTS.map((p) => p.category?.name).filter(Boolean)),
  ];

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="">
      {/* Header Banner Section */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg md:text-xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Max Redeem <span className="text-brand-600">Mall</span>
        </h1>
        <div>
          <PrimaryButton>View Order Transactions</PrimaryButton>
        </div>
      </div>
      <hr />
      <div className="w-full mx-auto mt-4">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-gray-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}

            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 ml-auto md:ml-2">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-6 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaxRedeemMall;
