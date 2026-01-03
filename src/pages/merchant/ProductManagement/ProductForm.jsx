import React, { useEffect, useMemo } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { productSchema } from "../../../schemas/productSchema";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetSingleProductQuery,
  useValidateSkuMutation,
} from "../../../redux/features/merchant/product/productApi";
import { useGetAllCategoriesQuery } from "../../../redux/features/admin/category/categoryApi";
import { useGetAllBrandsQuery } from "../../../redux/features/admin/brand/brandApi";
import { useGetAllSubCategoriesQuery } from "../../../redux/features/admin/subCategory/subCategoryApi";
import { useGetAllAttributesQuery } from "../../../redux/features/admin/attribute/attributeApi";
import { useGetAllAttributeItemsQuery } from "../../../redux/features/admin/attributeItem/attributeItemApi";
import { useGetAllGendersQuery } from "../../../redux/features/admin/gender/genderApi";
import { useGetAllModelsQuery } from "../../../redux/features/admin/model/modelApi";

// Form Sections
import ProductBasicInfo from "./components/ProductBasicInfo";
import ProductMedia from "./components/ProductMedia";
import VariationGenerator from "./components/VariationGenerator";
import VariationList from "./components/VariationList";
import ColorImageGallery from "./components/ColorImageGallery";
import { useSelector } from "react-redux";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import { useGetCurrentSettingsQuery } from "../../../redux/features/admin/settings/settingsApi";

import ProductFormSkeleton from "../../../components/skeleton/ProductFormSkeleton";

const ProductForm = () => {
  const { user, token } = useSelector((state) => state.auth);

  const role = user?.role || "merchant";

  const { data } = useVerifyMeQuery(role, { skip: !token });
  const { data: settingsData } = useGetCurrentSettingsQuery();

  const rmPoints = settingsData?.setting_attribute?.maxreward?.rm_points;
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [validateSku] = useValidateSkuMutation();

  const { data: productData, isLoading: isLoadingProduct } =
    useGetSingleProductQuery(id, {
      skip: !isEditMode,
    });

  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data?.categories || [];

  const { data: brandsData } = useGetAllBrandsQuery();
  const brands = brandsData?.data?.brands || [];

  const { data: subCategoriesData } = useGetAllSubCategoriesQuery();
  const subCategories =
    subCategoriesData?.data?.sub_categories ||
    subCategoriesData?.data?.subCategories ||
    [];

  const { data: attributesData } = useGetAllAttributesQuery();
  const attributes =
    attributesData?.data?.attributes || attributesData?.data || [];

  const { data: attributeItemsData } = useGetAllAttributeItemsQuery();
  const attributeItems =
    attributeItemsData?.data?.attribute_items || attributeItemsData?.data || [];

  const { data: gendersData } = useGetAllGendersQuery();
  const genders = gendersData?.data?.genders || gendersData?.data || [];

  const { data: modelsData } = useGetAllModelsQuery();
  const models = modelsData?.data?.models || modelsData?.data || [];

  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku_short_code: "",
      category_id: "",
      sub_category_id: "",
      brand_id: "",
      gender_id: "",
      model_id: "",
      description: "",
      status: "draft",
      product_type: "variable",
      images: [],

      // Simple Product defaults
      regular_price: "",
      regular_point: "",
      sale_price: "",
      sale_point: "",
      cost_price: "",
      unit_weight: "",

      // Variable Product defaults
      variations: [],
      color_images: {},
      delete_images: [],
      deleted_color_images: {},
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = methods;

  const {
    fields: variationFields,
    replace: replaceVariations,
    remove: removeVariation,
    append: appendVariations,
  } = useFieldArray({
    control,
    name: "variations",
  });

  const productType = watch("product_type");

  const initialSelectedAttributes = useMemo(() => {
    const data = productData?.data || productData;
    if (!data) return [];

    const grouped = data.grouped_attributes || data.groupedAttributes || [];

    if (grouped.length > 0) {
      return grouped
        .map((group) => {
          const attributeId = group.attribute_id ?? group.attributeId ?? "";
          if (!attributeId) return null;
          const itemIds = (group.items || group.attribute_items || [])
            .map((item) => Number(item.item_id ?? item.id))
            .filter((id) => !Number.isNaN(id));
          return {
            attribute_id: String(attributeId),
            attribute_item_ids: itemIds,
          };
        })
        .filter(Boolean);
    }

    if (!data.variations || data.variations.length === 0) return [];

    const map = new Map();

    data.variations.forEach((variation) => {
      const attrs =
        variation.variation_attributes || variation.attributes || [];
      attrs.forEach((attr) => {
        const attrId = attr.attribute_id || attr.attribute?.id;
        const itemId = attr.attribute_item_id || attr.attribute_item?.id;
        if (!attrId || !itemId) return;
        const key = String(attrId);
        const value = Number(itemId);
        if (Number.isNaN(value)) return;
        if (!map.has(key)) {
          map.set(key, new Set());
        }
        map.get(key).add(value);
      });
    });

    return Array.from(map.entries()).map(([attribute_id, itemSet]) => ({
      attribute_id,
      attribute_item_ids: Array.from(itemSet),
    }));
  }, [productData]);

  useEffect(() => {
    if (productData && isEditMode) {
      const data = productData.data || productData;

      // Extract Color Images for the Gallery
      const initialColorImages = {};
      if (data.variations) {
        data.variations.forEach((v) => {
          const colorAttr = v.variation_attributes?.find((va) => {
            const name = va.attribute?.name?.toLowerCase();
            return name && (name.includes("color") || name.includes("colour"));
          });

          if (colorAttr && v.images && v.images.length > 0) {
            const colorId = colorAttr.attribute_item_id;
            // Only add if not already present (assuming same color variations share images or first one is representative)
            if (!initialColorImages[colorId]) {
              initialColorImages[colorId] = v.images;
            }
          }
        });
      }

      reset({
        name: data.name || "",
        sku_short_code: data.sku_short_code || "",
        category_id: data.category_id || "",
        sub_category_id: data.subcategory_id || data.sub_category_id || "",
        brand_id: data.brand_id || "",
        gender_id: data.gender_id || "",
        model_id: data.model_id || "",
        description: data.description || "",
        status: data.status || "draft",
        product_type: data.type || "variable",
        images: data.images || [],

        regular_price: data.regular_price ? String(data.regular_price) : "",
        regular_point: data.regular_point ? String(data.regular_point) : "",
        sale_price: data.sale_price ? String(data.sale_price) : "",
        sale_point: data.sale_point ? String(data.sale_point) : "",
        cost_price: data.cost_price ? String(data.cost_price) : "",
        unit_weight: data.unit_weight ? String(data.unit_weight) : "",

        variations:
          data.variations?.map((v) => ({
            ...v,
            variation_id: v.id,
            regular_price: String(v.regular_price),
            regular_point: v.regular_point ? String(v.regular_point) : "",
            actual_quantity: String(v.actual_quantity),
            attributes:
              v.variation_attributes?.map((va) => ({
                attribute_id: va.attribute_id,
                attribute_item_id: va.attribute_item_id,
                attribute_name: va.attribute?.name,
                attribute_item_name: va.attribute_item?.name,
              })) || v.attributes,
          })) || [],

        color_images: initialColorImages,
      });
    }
  }, [productData, isEditMode, reset]);

  const handleSkuValidation = async (sku) => {
    if (!sku) return;
    try {
      const result = await validateSku({ sku, product_id: id }).unwrap();
      if (!result.available) {
        setError("sku_short_code", { type: "manual", message: result.message });
      } else {
        clearErrors("sku_short_code");
      }
    } catch (err) {
      console.error("SKU validation failed", err);
    }
  };
  const merchantId = data?.merchant_id || data?.merchant?.id;
  const onSubmit = async (formData) => {
    try {
      const data = new FormData();

      // Basic Fields
      data.append("merchant_id", merchantId);
      data.append("name", formData.name);
      data.append(
        "sku_short_code",
        formData.sku_short_code?.replace(/\s+/g, "-")
      );
      data.append("type", formData.product_type);
      data.append("category_id", formData.category_id);
      data.append("brand_id", formData.brand_id);

      // Default to "active" if not provided, though checking form logic "draft" is default
      data.append("status", formData.status || "draft");

      if (formData.sub_category_id)
        data.append("subcategory_id", formData.sub_category_id);
      if (formData.gender_id) data.append("gender_id", formData.gender_id);
      if (formData.model_id) data.append("model_id", formData.model_id);
      if (formData.description)
        data.append("description", formData.description);

      // --- Delete Images (Main Product) ---
      const deleteImages = formData.delete_images;
      if (deleteImages && deleteImages.length > 0) {
        deleteImages.forEach((img, idx) => {
          // Backend expects array of identifiers to delete.
          // If the backend uses 'deleteMultipleImages' with Cloudinary, it likely needs public_id.
          // Ideally we send the public_id if available, or the full object/url depending on backend expectation.
          // Based on backend code, it calls deleteMultipleImages($deleteImages).
          // We'll append the unique identifier.
          const valueToDelete = img.public_id || img.url || img;
          data.append(`delete_images[${idx}]`, valueToDelete);
        });
      }

      // --- Simple Product Logic ---
      if (formData.product_type === "simple") {
        data.append("regular_price", formData.regular_price);
        data.append("regular_point", formData.regular_point);
        if (formData.sale_price) data.append("sale_price", formData.sale_price);
        if (formData.sale_point) data.append("sale_point", formData.sale_point);
        if (formData.cost_price) data.append("cost_price", formData.cost_price);
        if (formData.unit_weight)
          data.append("unit_weight", formData.unit_weight);
        if (formData.actual_quantity)
          data.append("actual_quantity", formData.actual_quantity);
      }

      // --- Variable Product Logic ---
      // --- Variable Product Logic ---
      const formVariations = getValues("variations");
      const formColorImages = getValues("color_images");
      const formDeletedColorImages = getValues("deleted_color_images");

      if (formData.product_type === "variable" && formVariations?.length) {
        // Derive root prices from variations (using Min values)
        const regularPrices = formVariations
          .map((v) => Number(v.regular_price))
          .filter((n) => !isNaN(n));
        const salePrices = formVariations
          .map((v) => Number(v.sale_price))
          .filter((n) => !isNaN(n));
        const costPrices = formVariations
          .map((v) => Number(v.cost_price))
          .filter((n) => !isNaN(n));
        const regularPoints = formVariations
          .map((v) => Number(v.regular_point))
          .filter((n) => !isNaN(n));
        const salePoints = formVariations
          .map((v) => Number(v.sale_point))
          .filter((n) => !isNaN(n));

        if (regularPrices.length)
          data.append("regular_price", Math.min(...regularPrices));
        if (salePrices.length)
          data.append("sale_price", Math.min(...salePrices));
        if (costPrices.length)
          data.append("cost_price", Math.min(...costPrices));
        if (regularPoints.length)
          data.append("regular_point", Math.min(...regularPoints));
        if (salePoints.length)
          data.append("sale_point", Math.min(...salePoints));

        // For unit_weight, we can take the first one or just ignore if not common.
        if (formData.unit_weight) {
          data.append("unit_weight", formData.unit_weight);
        } else {
          const weight = formVariations.find((v) => v.unit_weight)?.unit_weight;
          if (weight) data.append("unit_weight", weight);
        }

        formVariations.forEach((v, index) => {
          data.append(`variations[${index}][sku]`, v.sku);
          data.append(`variations[${index}][regular_price]`, v.regular_price);
          data.append(`variations[${index}][regular_point]`, v.regular_point);
          data.append(
            `variations[${index}][actual_quantity]`,
            v.actual_quantity
          );

          if (v.sale_price)
            data.append(`variations[${index}][sale_price]`, v.sale_price);
          if (v.sale_point)
            data.append(`variations[${index}][sale_point]`, v.sale_point);
          if (v.cost_price)
            data.append(`variations[${index}][cost_price]`, v.cost_price);
          if (v.low_stock_threshold)
            data.append(
              `variations[${index}][low_stock_threshold]`,
              v.low_stock_threshold
            );
          if (v.ean_no) data.append(`variations[${index}][ean_no]`, v.ean_no);
          if (v.unit_weight)
            data.append(`variations[${index}][unit_weight]`, v.unit_weight);

          // Attributes
          if (v.attributes) {
            v.attributes.forEach((attr, aIndex) => {
              data.append(
                `variations[${index}][attributes][${aIndex}][attribute_id]`,
                attr.attribute_id
              );
              data.append(
                `variations[${index}][attributes][${aIndex}][attribute_item_id]`,
                attr.attribute_item_id
              );
            });
          }

          // Delete Variation Images
          let deletedImagesForVariation = [];
          if (v.attributes && formDeletedColorImages) {
            const colorAttr = v.attributes.find((attr) => {
              let name = attr.attribute_name;
              // Fallback: lookup attribute name from global list if missing in variation
              if (!name && attributes) {
                const found = attributes.find((a) => a.id == attr.attribute_id);
                if (found) name = found.name;
              }
              const lower = name?.toLowerCase();
              return (
                lower && (lower.includes("color") || lower.includes("colour"))
              );
            });

            if (
              colorAttr &&
              formDeletedColorImages[colorAttr.attribute_item_id]
            ) {
              deletedImagesForVariation =
                formDeletedColorImages[colorAttr.attribute_item_id];
            }
          }

          if (deletedImagesForVariation.length > 0) {
            deletedImagesForVariation.forEach((dImg, dIdx) => {
              const dValue = dImg.public_id || dImg.url || dImg;
              data.append(
                `variations[${index}][delete_images][${dIdx}]`,
                dValue
              );
            });
          }

          // Variation Images
          const specificImages =
            v.images && v.images.length > 0 ? Array.from(v.images) : [];

          let colorImages = [];
          // If we have a color gallery, check if this variation matches a color
          if (v.attributes && formColorImages) {
            const colorAttr = v.attributes.find((attr) => {
              let name = attr.attribute_name;

              // Fallback: lookup attribute name from global list if missing in variation
              if (!name && attributes) {
                const found = attributes.find((a) => a.id == attr.attribute_id);
                if (found) name = found.name;
              }

              const lower = name?.toLowerCase();
              return (
                lower && (lower.includes("color") || lower.includes("colour"))
              );
            });

            if (colorAttr && formColorImages[colorAttr.attribute_item_id]) {
              const colorFiles = formColorImages[colorAttr.attribute_item_id];
              if (colorFiles.length > 0) {
                colorImages = Array.from(colorFiles);
              }
            }
          }

          const allImages = [...specificImages, ...colorImages];

          if (allImages.length > 0) {
            allImages.forEach((file, imgIndex) => {
              if (file instanceof File) {
                data.append(`variations[${index}][images][${imgIndex}]`, file);
              }
            });
          }
        });
      }

      // General Images (Indexed)
      // Use getValues for images to be safe, though formData usually has them if input exists
      const rootImages = getValues("images");
      if (rootImages && rootImages.length > 0) {
        Array.from(rootImages).forEach((file, index) => {
          if (file instanceof File) {
            data.append(`images[${index}]`, file);
          }
        });
      }

      if (isEditMode) {
        await updateProduct({ id, data }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createProduct(data).unwrap();
        toast.success("Product created successfully!");
      }
      navigate("/merchant/product/all-products");
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error(
        err?.data?.message || err?.message || "Failed to save product"
      );
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingProduct;

  if (isEditMode && isLoadingProduct) {
    return <ProductFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/merchant" },
          { label: "Products", to: "/merchant/product/all-products" },
          { label: isEditMode ? "Edit Product" : "Create Product" },
        ]}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <ProductBasicInfo
            handleSkuValidation={handleSkuValidation}
            brands={brands}
            categories={categories}
            subCategories={subCategories}
            genders={genders}
            models={models}
            rmPoints={rmPoints}
            productType={productType}
          />

          <ProductMedia />

          <ComponentCard title="Product Data">
            {/* Type Switch Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Configuration
                </h3>
                <p className="text-sm text-gray-500">
                  Choose between a simple product or one with variations.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 sm:mt-0 bg-gray-50 px-4 py-2 rounded-full border">
                <span
                  className={`text-sm font-semibold transition-colors ${
                    productType === "variable"
                      ? "text-gray-400"
                      : "text-brand-600"
                  }`}
                >
                  Simple
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={productType === "variable"}
                  onClick={() =>
                    setValue(
                      "product_type",
                      productType === "variable" ? "simple" : "variable"
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                    productType === "variable" ? "bg-brand-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                      productType === "variable"
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span
                  className={`text-sm font-semibold transition-colors ${
                    productType === "variable"
                      ? "text-brand-600"
                      : "text-gray-400"
                  }`}
                >
                  Variable
                </span>
              </div>
            </div>

            {/* Simple Product Inputs - Moved to ProductBasicInfo */}
            {/* {productType === "simple" && (
              <SimpleProductFields rmPoints={rmPoints} />
            )} */}

            {/* Variable Product Inputs */}
            {productType === "variable" && (
              <div className="space-y-8 animate-fade-in-down">
                <VariationGenerator
                  attributes={attributes}
                  attributeItems={attributeItems}
                  productId={id}
                  replaceVariations={replaceVariations}
                  appendVariations={appendVariations}
                  initialSelectedAttributes={initialSelectedAttributes}
                />

                <ColorImageGallery variations={variationFields} />
                <VariationList
                  variationFields={variationFields}
                  removeVariation={removeVariation}
                  isEditMode={isEditMode}
                  rmPoints={rmPoints}
                />
                {/* Error Message for Variations */}
                {errors.variations && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span className="text-sm font-medium">
                      {errors.variations.message ||
                        "At least one variation is required."}
                    </span>
                  </div>
                )}
              </div>
            )}
          </ComponentCard>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 pb-12">
            <PrimaryButton
              type="button"
              variant="outline"
              onClick={() => navigate("/merchant/product/all-products")}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </PrimaryButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ProductForm;
