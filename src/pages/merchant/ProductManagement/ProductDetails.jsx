import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { useGetSingleProductQuery } from "../../../redux/features/merchant/product/productApi";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import ProductSkeleton from "../../../components/skeleton/ProductSkeleton";
import {
  ArrowLeft,
  Box,
  Check,
  Copy,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "../../../components/table/StatusBadge";

const ProductDetails = () => {
  const { id } = useParams();
  const { data: productData, isLoading } = useGetSingleProductQuery(id);
  const [activeImage, setActiveImage] = useState(null);

  const product = productData?.data || productData;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb items={[{ label: "..." }]} />
        <ComponentCard>
          <div className="p-8 text-center text-gray-500">
            Loading product details...
          </div>
        </ComponentCard>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb items={[{ label: "Products" }]} />
        <ComponentCard>
          <div className="p-8 text-center text-red-500">Product not found</div>
        </ComponentCard>
      </div>
    );
  }

  // Determine main image and gallery
  const mainImage = activeImage || product.images?.[0]?.url || null;
  const galleryImages = product.images?.map((img) => img.url) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/merchant" },
            { label: "Products", to: "/merchant/product/all-products" },
            { label: product.name },
          ]}
        />
        <Link
          to={`/merchant/product/edit/${product.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-sm font-medium text-sm"
        >
          Edit Product
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Images */}
        <div className="lg:col-span-1 space-y-4">
          <div className="aspect-square bg-white border rounded-xl overflow-hidden flex items-center justify-center relative group shadow-sm">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="text-gray-300 flex flex-col items-center">
                <ImageIcon size={48} />
                <span className="text-sm mt-2">No Image</span>
              </div>
            )}
          </div>

          {/* Quick Image Gallery */}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square border rounded-lg overflow-hidden p-1 hover:border-brand-500 transition ${
                    activeImage === img
                      ? "ring-2 ring-brand-500 border-brand-500"
                      : "bg-white"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Key Details */}
        <div className="lg:col-span-2 space-y-6">
          <ComponentCard>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-4 mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 capitalize">
                    {product.type} product
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5" title="Copy SKU">
                    <Tag size={14} />
                    <span className="font-mono">
                      {product.sku_short_code || "N/A"}
                    </span>
                    {product.sku_short_code && (
                      <button
                        onClick={() => handleCopy(product.sku_short_code)}
                        className="hover:text-brand-600"
                      >
                        <Copy size={12} />
                      </button>
                    )}
                  </div>
                  <span>|</span>
                  <span>
                    Added on {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <StatusBadge status={product.status} />
            </div>

            {/* Price & Points Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">
                  Regular Price
                </span>
                <p className="text-lg font-bold text-gray-900">
                  RM {product.regular_price}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">
                  Sale Price
                </span>
                <p className="text-lg font-bold text-green-600">
                  {product.sale_price > 0 ? `RM ${product.sale_price}` : "-"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">
                  Regular Point
                </span>
                <p className="text-lg font-bold text-gray-900">
                  {product.regular_point}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">
                  Sale Point
                </span>
                <p className="text-lg font-bold text-brand-600">
                  {product.sale_point > 0 ? product.sale_point : "-"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <div className="prose prose-sm max-w-none text-gray-600 bg-white p-4 rounded-lg border">
                {product.description || "No description provided."}
              </div>
            </div>

            {/* Classification */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Classification
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailItem label="Category" value={product.category?.name} />
                <DetailItem
                  label="Sub Category"
                  value={product.sub_category?.name}
                />
                <DetailItem label="Brand" value={product.brand?.name} />
                <DetailItem label="Model" value={product.model?.name} />
                <DetailItem label="Gender" value={product.gender?.name} />
                <DetailItem
                  label="Unit Weight"
                  value={
                    product.unit_weight ? `${product.unit_weight} kg` : "-"
                  }
                />
                <DetailItem
                  label="Actual Qty"
                  value={product.actual_quantity || "0"}
                />
                <DetailItem
                  label="Cost Price"
                  value={product.cost_price ? `RM ${product.cost_price}` : "-"}
                />
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Full Width: Variations (if any) */}
        {product.variations && product.variations.length > 0 && (
          <div className="lg:col-span-3">
            <ComponentCard
              title={`Product Variations (${product.variations.length})`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 min-w-[50px] w-[50px]">Image</th>
                      <th className="px-4 py-3">Variation</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Points</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Cost</th>
                      <th className="px-4 py-3 text-right">EAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {product.variations.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="h-10 w-10 border rounded bg-white overflow-hidden flex items-center justify-center">
                            {v.images?.[0]?.url ? (
                              <img
                                src={v.images[0].url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon size={14} className="text-gray-300" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {v.variation_attributes
                            ?.map(
                              (va) =>
                                `${va.attribute?.name}: ${va.attribute_item?.name}`
                            )
                            .join(", ") || "Default"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{v.sku}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span>RM {v.regular_price}</span>
                            {v.sale_price > 0 && (
                              <span className="text-xs text-green-600">
                                Sale: RM {v.sale_price}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span>{v.regular_point} Pts</span>
                            {v.sale_point > 0 && (
                              <span className="text-xs text-brand-600">
                                Sale: {v.sale_point}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              v.actual_quantity > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {v.actual_quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {v.cost_price ? `RM ${v.cost_price}` : "-"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">
                          {v.ean_no}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ComponentCard>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-100">
    <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </span>
    <span
      className="font-medium text-gray-900 text-sm truncate"
      title={value || "-"}
    >
      {value || "-"}
    </span>
  </div>
);

export default ProductDetails;
