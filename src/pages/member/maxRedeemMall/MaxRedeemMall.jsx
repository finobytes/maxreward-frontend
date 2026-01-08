import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { useGetProductsQuery } from "../../../redux/features/merchant/product/productApi";
import { useGetAllCategoriesQuery } from "../../../redux/features/admin/category/categoryApi";
import ProductSkeleton from "../../../components/skeleton/ProductSkeleton";

const MaxRedeemMall = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Products using API
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
  } = useGetProductsQuery({
    page,
    per_page: 12,
    search: debouncedSearch,
    category_id: selectedCategoryId,
    // status: "approved", // Member sees approved products
    // merchant_id: "", // If we needed to filter by specific merchant for member view
  });

  // Fetch Categories for filter
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data?.categories || [];

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {};

  const handleCategoryChange = (id) => {
    setSelectedCategoryId(id);
    setPage(1); // Reset page on category change
  };

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
            <button
              onClick={() => handleCategoryChange("")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                selectedCategoryId === ""
                  ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-gray-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  String(selectedCategoryId) === String(cat.id)
                    ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-gray-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}

            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 ml-auto md:ml-2">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-xl h-[400px] border border-gray-100"
              ></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity ${
                isFetchingProducts ? "opacity-50" : "opacity-100"
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.lastPage > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {[...Array(pagination.lastPage)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-10 w-10 rounded-lg border font-medium transition-all ${
                      page === i + 1
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
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
                setSelectedCategoryId("");
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
