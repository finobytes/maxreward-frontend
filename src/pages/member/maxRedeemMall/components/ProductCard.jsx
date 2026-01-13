import React from "react";
import { Link } from "react-router";
import { Eye, Heart, ShoppingBag } from "lucide-react";

const ProductCard = ({ product }) => {
  // Determine display price and points
  const isVariable = product.type === "variable";

  // For variable products, we might generally show the "lowest" price/point or a range
  // In the mock data, the root product has regular_price/point which seems to be the min.
  const price =
    product.sale_price > 0 ? product.sale_price : product.regular_price;
  const points =
    product.sale_point > 0 ? product.sale_point : product.regular_point;

  // Image: Prioritize first image
  // Handle case where product might not have images (though mock has them)
  const image = product.images?.[0]?.url
    ? product.images[0].url
    : isVariable && product.variations?.[0]?.images?.[0]?.url
    ? product.variations[0].images[0].url
    : "https://placehold.co/400x400?text=No+Image";

  return (
    <div className="group bg-white rounded-xl border border-gray-100 hover:border-brand-200 overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link to={`/member/max-redeem-mall/${product.id}`}>
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.sale_price > 0 &&
            Number(product.sale_price) < Number(product.regular_price) && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                SALE
              </span>
            )}
          {isVariable && (
            <span className="bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
              OPTIONS
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          {/* <button className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 shadow-md transition-colors">
            <Heart size={16} />
          </button> */}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Category / Brand */}
        <div className="text-xs text-gray-500 mb-1 truncate">
          {product.brand?.name || product.category?.name}
        </div>

        <Link to={`/member/max-redeem-mall/${product.id}`} className="block">
          <h3 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2 min-h-[2.5rem] mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-2 flex items-end justify-between border-t border-gray-50">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-brand-600">
                {points?.toLocaleString()} Pts
              </span>
              {/* If sale, show original points struck through? Not in mock explicitly but good practice */}
            </div>
            <div className="text-xs text-gray-500">or RM {price}</div>
          </div>

          <Link
            to={`/member/max-redeem-mall/${product.id}`}
            className="p-2 rounded-lg bg-gray-200 text-gray-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"
          >
            <Eye size={16} /> <span className="ml-2 text-xs">View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
