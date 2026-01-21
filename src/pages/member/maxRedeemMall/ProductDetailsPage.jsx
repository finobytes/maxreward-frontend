import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router";
import {
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useGetSingleProductQuery } from "../../../redux/features/merchant/product/productApi";
import { useAddToCartMutation } from "../../../redux/features/member/maxRedeemMall/maxRedeemApi";

const ZOOM_SCALE = 2.4;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();
  const { data: productData, isLoading } = useGetSingleProductQuery(id);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const imageContainerRef = useRef(null);
  const zoomPaneRef = useRef(null);
  const zoomRafRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const product = productData?.data || productData;

  // Helper: Find Variation Match
  const currentVariation = useMemo(() => {
    if (!product || product.type !== "variable" || !product.variations)
      return null;

    // Find variation that matches ALL selected attributes
    return product.variations.find((v) => {
      if (!v.variation_attributes) return false;

      // Check if every selected attribute matches this variation's attributes
      return Object.entries(selectedAttributes).every(([attrId, itemId]) => {
        // Find the attribute in variation details
        const vAttr = v.variation_attributes.find(
          (va) => String(va.attribute_id) === String(attrId)
        );
        return vAttr && String(vAttr.attribute_item_id) === String(itemId);
      });
    });
  }, [product, selectedAttributes]);

  // If we have a full match (number of selected attributes equals available attributes)
  const isVariationSelected = useMemo(() => {
    if (!product?.grouped_attributes) return false;
    return (
      product.grouped_attributes.length ===
      Object.keys(selectedAttributes).length
    );
  }, [product, selectedAttributes]);

  // Helper: Get Images
  const displayImages = useMemo(() => {
    if (!product) return [];

    // 1. If Color is selected, try to find images for that color
    // Find the "Color" attribute ID
    const colorGroup = product.grouped_attributes?.find((g) =>
      g.attribute_name?.toLowerCase().includes("colo")
    );

    if (colorGroup) {
      const selectedColorItemId = selectedAttributes[colorGroup.attribute_id];
      if (selectedColorItemId) {
        // Find a variation with this color
        const colorVar = product.variations?.find((v) =>
          v.variation_attributes?.some(
            (va) =>
              String(va.attribute_id) === String(colorGroup.attribute_id) &&
              String(va.attribute_item_id) === String(selectedColorItemId)
          )
        );

        if (colorVar && colorVar.images?.length > 0) {
          return colorVar.images.map((img) => img.url);
        }
      }
    }

    // 2. Fallback to product images
    if (product.images?.length > 0) {
      return product.images.map((img) => img.url);
    }

    return ["https://placehold.co/600x600?text=No+Image"];
  }, [product, selectedAttributes]);

  const activeImage = selectedImage || displayImages[0];

  useEffect(() => {
    if (
      displayImages.length > 0 &&
      (!selectedImage || !displayImages.includes(selectedImage))
    ) {
      setSelectedImage(displayImages[0]);
    }
  }, [displayImages, selectedImage]);

  useEffect(() => {
    setIsZoomed(false);
    if (zoomPaneRef.current) {
      zoomPaneRef.current.style.backgroundPosition = "50% 50%";
    }
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      if (zoomRafRef.current) {
        cancelAnimationFrame(zoomRafRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/member/max-redeem-mall"
          className="px-6 py-2 bg-brand-600 text-white rounded-lg"
        >
          Back to Mall
        </Link>
      </div>
    );
  }

  // Prices / Points Logic
  const price = currentVariation
    ? currentVariation.sale_price > 0
      ? currentVariation.sale_price
      : currentVariation.regular_price
    : product.sale_price > 0
    ? product.sale_price
    : product.regular_price;

  const points = currentVariation
    ? currentVariation.sale_point > 0
      ? currentVariation.sale_point
      : currentVariation.regular_point
    : product.sale_point > 0
    ? product.sale_point
    : product.regular_point;

  const regularPrice = currentVariation?.regular_price || product.regular_price;

  const stock = currentVariation
    ? currentVariation.actual_quantity
    : product.type === "simple"
    ? product.variations?.[0]?.actual_quantity || 0
    : 0;

  const handleAttributeSelect = (attrId, itemId) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attrId]: itemId,
    }));
  };

  const handleAddToCart = async () => {
    if (product.type === "variable" && !isVariationSelected) {
      toast.error("Please select all options");
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    const payload = {
      product_id: product.id,
      product_variation_id:
        currentVariation?.id ||
        (product.type === "simple" ? product.variations?.[0]?.id : null),
      quantity: quantity,
    };

    try {
      await addToCartMutation(payload).unwrap();
      toast.success("Added to cart successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add to cart");
    }
  };

  const updateZoomOrigin = (clientX, clientY) => {
    if (!imageContainerRef.current || !zoomPaneRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    zoomPaneRef.current.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
  };

  const scheduleZoomOrigin = (clientX, clientY) => {
    lastPointerRef.current = { x: clientX, y: clientY };
    if (zoomRafRef.current) return;

    zoomRafRef.current = requestAnimationFrame(() => {
      const { x, y } = lastPointerRef.current;
      updateZoomOrigin(x, y);
      zoomRafRef.current = 0;
    });
  };

  const handlePointerEnter = (event) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      setIsZoomed(true);
      scheduleZoomOrigin(event.clientX, event.clientY);
    }
  };

  const handlePointerMove = (event) => {
    if (!isZoomed) return;
    scheduleZoomOrigin(event.clientX, event.clientY);
  };

  const handlePointerLeave = () => {
    setIsZoomed(false);
    if (zoomPaneRef.current) {
      zoomPaneRef.current.style.backgroundPosition = "50% 50%";
    }
  };

  return (
    <div className="pb-12">
      <div className="">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/member/max-redeem-mall" className="hover:text-brand-600">
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to="/member/max-redeem-mall" className="hover:text-brand-600">
            MaxRedeem Mall
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery Section */}
            <div className="space-y-6">
              <div
                ref={imageContainerRef}
                onPointerEnter={handlePointerEnter}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerCancel={handlePointerLeave}
                className={`aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                style={{ touchAction: "pan-y pinch-zoom" }}
                title="Hover to zoom"
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
                {!isZoomed && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent p-3">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Hover to zoom
                    </span>
                  </div>
                )}
                {/* <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-brand-50 text-gray-600 hover:text-red-500 shadow-sm transition-colors">
                  <Heart size={20} />
                </button> */}
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-4">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? "border-brand-600 ring-2 ring-brand-100"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white text-xs font-bold px-2 py-1 bg-brand-100 rounded uppercase tracking-wider">
                    {product.category?.name}
                  </span>
                  {product.sub_category && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded uppercase tracking-wider">
                      {product.sub_category.name}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  {/* <div className="flex items-center text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(128 reviews)</span>
                  <div className="h-4 w-[1px] bg-gray-300"></div> */}
                  <span
                    className={`text-sm font-medium ${
                      stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stock > 0
                      ? `In Stock (${stock} available)`
                      : "Out of Stock"}
                  </span>
                </div>

                <div className="flex items-end gap-3 pb-6 border-b border-gray-100">
                  <div className="text-4xl font-bold text-brand-600">
                    {points?.toLocaleString()}{" "}
                    <span className="text-2xl">Pts</span>
                  </div>
                  <div className="text-xl text-gray-500 mb-1">
                    or RM {price}
                  </div>
                  {Number(regularPrice) > Number(price) && (
                    <div className="text-sm text-gray-400 line-through mb-2">
                      RM {regularPrice}
                    </div>
                  )}
                </div>
              </div>

              {/* Attributes Selection */}
              {product.type === "variable" &&
                product.grouped_attributes?.map((group) => (
                  <div key={group.attribute_id}>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-semibold text-gray-900">
                        {group.attribute_name}
                      </label>
                      {/* Show selected value for clarity */}
                      <span className="text-xs text-gray-500">
                        {group.items.find(
                          (i) =>
                            String(i.item_id) ===
                            String(selectedAttributes[group.attribute_id])
                        )?.item_name || "Select"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {group.items.map((item) => {
                        const isSelected =
                          String(selectedAttributes[group.attribute_id]) ===
                          String(item.item_id);
                        return (
                          <button
                            key={item.item_id}
                            onClick={() =>
                              handleAttributeSelect(
                                group.attribute_id,
                                item.item_id
                              )
                            }
                            className={`
                              px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all
                              ${
                                isSelected
                                  ? "border-brand-600 bg-brand-50 text-white"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                              }
                            `}
                          >
                            {item.item_name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* Quantity */}
                <div className="flex items-center border-2 border-gray-200 rounded-xl w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 text-gray-600"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 text-gray-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || stock === 0}
                  className="flex-1 bg-brand-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-gray-200 hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} />
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>
                <button className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>

              {/* Features / Trust Badges */}
              <div className="grid grid-cols-2 gap-4 py-6">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <Truck className="text-brand-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">
                    Free Shipping
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <ShieldCheck className="text-brand-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">
                    Authentic Guarantee
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <RotateCcw className="text-brand-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">
                    7 Days Return
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`hidden lg:block absolute top-0 bottom-0 right-0 left-[calc(50%+1.5rem)] bg-white rounded-2xl border border-gray-100 shadow-2xl transition-opacity duration-200 motion-reduce:transition-none z-20 ${
              isZoomed ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden="true"
          >
            <div className="h-full w-full p-4">
              <div className="aspect-square w-full bg-white rounded-xl border border-gray-100 overflow-hidden relative">
                <div
                  ref={zoomPaneRef}
                  className="absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: activeImage ? `url(${activeImage})` : "none",
                    backgroundSize: `${ZOOM_SCALE * 100}%`,
                    backgroundPosition: "50% 50%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs (Description, etc) */}
        <div className="mt-2 md:mt-4 ">
          {" "}
          <div className=" border-t pt-8">
            <div className="flex gap-6 border-b mb-4">
              {["description", "specifications"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-brand-600 text-brand-600"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="prose prose-sm prose-gray max-w-none">
              {activeTab === "description" && (
                <p>{product.description || "No description available."}</p>
              )}
              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 gap-y-2">
                  <div className="grid grid-cols-3 border-b py-2">
                    <span className="font-semibold">Brand</span>{" "}
                    <span className="col-span-2">{product.brand?.name}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b py-2">
                    <span className="font-semibold">Model</span>{" "}
                    <span className="col-span-2">{product.model?.name}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b py-2">
                    <span className="font-semibold">Weight</span>{" "}
                    <span className="col-span-2">{product.unit_weight} kg</span>
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <p className="text-gray-500 italic">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
