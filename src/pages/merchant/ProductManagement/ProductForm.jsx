import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Select from "@/components/form/Select";
import MultiSelect from "react-select"; // Using react-select for multi-selection of values
import Dropzone from "../../../components/form/form-elements/Dropzone";
import { productSchema } from "../../../schemas/productSchema";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetSingleProductQuery,
} from "../../../redux/features/merchant/product/productApi";
import { useGetAllCategoriesQuery } from "../../../redux/features/admin/category/categoryApi";
import { useGetAllBrandsQuery } from "../../../redux/features/admin/brand/brandApi";
import { useGetAllSubCategoriesQuery } from "../../../redux/features/admin/subCategory/subCategoryApi";
import { useGetAllAttributesQuery } from "../../../redux/features/admin/attribute/attributeApi";
import { useGetAllAttributeItemsQuery } from "../../../redux/features/admin/attributeItem/attributeItemApi";
import { useGetAllGendersQuery } from "../../../redux/features/admin/gender/genderApi";
import { useGetAllModelsQuery } from "../../../redux/features/admin/model/modelApi";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
    getValues,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category_id: "",
      sub_category_id: "",
      brand_id: "",
      gender_id: "",
      model_id: "",
      price: "",
      quantity: "",
      description: "",
      status: "pending",
      product_type: "variable",
      images: [],
      variations: [], // We will store selected attributes and their values here
      // Structure: [{ attribute_id: 1, values: [1, 2], is_image_selector: true }]
    },
  });

  const selectedCategoryId = watch("category_id");
  const variationConfig = watch("variations");
  const productType = watch("product_type");

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category_id == selectedCategoryId
  );

  // Helper to get items for an attribute
  const getItemsForAttribute = (attrId) => {
    return attributeItems.filter((item) => item.attribute_id == attrId);
  };

  useEffect(() => {
    if (productData && isEditMode) {
      const data = productData.data || productData;
      reset({
        name: data.name || "",
        category_id: data.category_id || "",
        sub_category_id: data.sub_category_id || "",
        brand_id: data.brand_id || "",
        gender_id: data.gender_id || "",
        model_id: data.model_id || "",
        price: data.price ? String(data.price) : "",
        quantity: data.quantity ? String(data.quantity) : "",
        description: data.description || "",
        product_type: data.product_type || "variable",
        // status: data.status || "pending", // Status removed as per user request
        images: data.images || [], // Handle existing images display logic if needed (convert string URLs to objects for Dropzone)
        variations: data.variations || [],
      });
      // Note: Handling existing images for edit mode requires Dropzone compatibility (urls).
      // The current Dropzone component takes `initialFiles` prop.
    }
  }, [productData, isEditMode, reset]);

  const onSubmit = async (formData) => {
    try {
      // Construct FormData for file upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("product_type", formData.product_type);
      data.append("category_id", formData.category_id);
      if (formData.sub_category_id)
        data.append("sub_category_id", formData.sub_category_id);
      data.append("brand_id", formData.brand_id);
      if (formData.gender_id) data.append("gender_id", formData.gender_id);
      if (formData.model_id) data.append("model_id", formData.model_id);
      data.append("price", formData.price);
      data.append("quantity", formData.quantity);
      if (formData.description)
        data.append("description", formData.description);

      // Handle General Images
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((file) => {
          if (file instanceof File) {
            data.append("images[]", file);
          }
        });
      }

      // Handle Variations & Variation Images
      // This part depends heavily on how backend expects variation data.
      // Assuming we send variations metadata and separate images keyed by something.
      // Or we append complex structure.

      // Since I don't know the exact backend structure for variations, I'll stringify the config
      // and append images with specific keys like `variation_images[color_red][]`.

      // For now, let's just append the variation config as JSON
      data.append("variations_config", JSON.stringify(formData.variations));

      // Append variation images
      formData.variations?.forEach((variation) => {
        // If this attribute drives images
        // We might have stored images in `variation.image_files` object keyed by item ID
        if (variation.image_files) {
          Object.keys(variation.image_files).forEach((itemId) => {
            const files = variation.image_files[itemId];
            if (files && files.length) {
              files.forEach((file) => {
                if (file instanceof File) {
                  data.append(
                    `variation_images_${variation.attribute_id}_${itemId}[]`,
                    file
                  );
                }
              });
            }
          });
        }
      });

      if (isEditMode) {
        data.append("_method", "PUT"); // Laravel often needs this for FormData PUT
        await updateProduct({ id, data }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createProduct(data).unwrap();
        toast.success("Product created successfully!");
      }
      navigate("/merchant/product/all-products");
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error(err?.data?.message || "Failed to save product");
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingProduct;

  // Variation Management Logic
  const addVariation = () => {
    const currentVars = getValues("variations") || [];
    setValue("variations", [
      ...currentVars,
      { attribute_id: "", values: [], image_files: {} },
    ]);
  };

  const removeVariation = (index) => {
    const currentVars = getValues("variations") || [];
    setValue(
      "variations",
      currentVars.filter((_, i) => i !== index)
    );
  };

  const updateVariation = (index, field, value) => {
    const currentVars = getValues("variations") || [];
    const updated = [...currentVars];
    updated[index][field] = value;
    setValue("variations", updated);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/merchant" },
          { label: "Products", to: "/merchant/product/all-products" },
          { label: isEditMode ? "Edit Product" : "Create Product" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentCard
          title={isEditMode ? "Edit Product Details" : "New Product Details"}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Enter product name"
                {...register("name")}
                error={!!errors.name}
                hint={errors.name?.message}
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Price (RM)</Label>
              <Input
                type="number"
                id="price"
                placeholder="0.00"
                step="0.01"
                {...register("price")}
                error={!!errors.price}
                hint={errors.price?.message}
              />
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                placeholder="0"
                {...register("quantity")}
                error={!!errors.quantity}
                hint={errors.quantity?.message}
              />
            </div>

            {/* Brand */}
            <div>
              <Label>Brand</Label>
              <Select
                {...register("brand_id")}
                options={brands.map((b) => ({ value: b.id, label: b.name }))}
                placeholder="Select Brand"
                error={!!errors.brand_id}
                hint={errors.brand_id?.message}
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>
              <Select
                {...register("category_id")}
                options={categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                placeholder="Select Category"
                error={!!errors.category_id}
                hint={errors.category_id?.message}
              />
            </div>

            {/* Gender */}
            <div>
              <Label>Gender</Label>
              <Select
                {...register("gender_id")}
                options={genders.map((g) => ({
                  value: g.id,
                  label: g.name,
                }))}
                placeholder="Select Gender"
                error={!!errors.gender_id}
                hint={errors.gender_id?.message}
              />
            </div>

            {/* Model */}
            <div>
              <Label>Model</Label>
              <Select
                {...register("model_id")}
                options={models.map((m) => ({
                  value: m.id,
                  label: m.name,
                }))}
                placeholder="Select Model"
                error={!!errors.model_id}
                hint={errors.model_id?.message}
              />
            </div>

            {/* SubCategory - Only shown if category is selected */}
            {selectedCategoryId && (
              <div className="animate-fade-in-down">
                <Label>Sub Category</Label>
                <Select
                  {...register("sub_category_id")}
                  options={filteredSubCategories.map((sc) => ({
                    value: sc.id,
                    label: sc.name,
                  }))}
                  placeholder="Select Sub Category"
                />
              </div>
            )}

            {/* Description */}
            <div className="sm:col-span-3">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Enter product description"
                {...register("description")}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                rows={4}
              />
            </div>
          </div>

          {/* General Images */}
          <div className="mt-6">
            <Label>Product Images (General)</Label>
            <div className="mt-2">
              <Controller
                control={control}
                name="images"
                render={({ field: { onChange } }) => (
                  <Dropzone
                    multiple={true}
                    maxFiles={12}
                    onFilesChange={onChange}
                    initialFiles={
                      isEditMode && productData?.images
                        ? productData.images
                        : []
                    } // Assuming productData.images is array of URL strings
                    validationMessage={errors.images?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Product Type Switch */}
          <div className="sm:col-span-1">
            <Label>Product Type</Label>

            <div className="flex items-center gap-3 mt-2">
              <span
                className={`text-sm font-medium ${
                  productType === "variable"
                    ? "text-brand-600"
                    : "text-gray-500"
                }`}
              >
                Variable
              </span>

              {/* Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={productType === "simple"}
                onClick={() =>
                  setValue(
                    "product_type",
                    productType === "variable" ? "simple" : "variable"
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  productType === "simple" ? "bg-brand-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    productType === "simple" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>

              <span
                className={`text-sm font-medium ${
                  productType === "simple" ? "text-brand-600" : "text-gray-500"
                }`}
              >
                Simple
              </span>
            </div>
          </div>
        </ComponentCard>

        {/* Variations Section - Only for Variable Products */}
        {productType === "variable" && (
          <ComponentCard title="Product Variations" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Add variations like Color, Size to your product.
                </p>
                <PrimaryButton type="button" size="sm" onClick={addVariation}>
                  + Add Variation Type
                </PrimaryButton>
              </div>

              {variationConfig?.map((variation, index) => {
                const availableItems = getItemsForAttribute(
                  variation.attribute_id
                );
                // Determine if this variation type controls images
                const isImageControl = variation.is_image_selector;

                return (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-gray-50 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeVariation(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Variation Type (Attribute)</Label>
                        <Select
                          value={variation.attribute_id}
                          onChange={(e) =>
                            updateVariation(
                              index,
                              "attribute_id",
                              e.target.value
                            )
                          }
                          options={attributes.map((a) => ({
                            value: a.id,
                            label: a.name,
                          }))}
                          placeholder="Select Attribute (e.g. Color)"
                        />
                      </div>

                      <div>
                        <Label>Values</Label>
                        <MultiSelect
                          isMulti
                          options={availableItems.map((i) => ({
                            value: i.id,
                            label: i.name,
                          }))}
                          value={variation.values
                            ?.map((valId) => {
                              const item = availableItems.find(
                                (i) => i.id == valId
                              );
                              return item
                                ? { value: item.id, label: item.name }
                                : null;
                            })
                            .filter(Boolean)}
                          onChange={(selected) =>
                            updateVariation(
                              index,
                              "values",
                              selected.map((s) => s.value)
                            )
                          }
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Select items (e.g. Red, Blue)"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`use-img-${index}`}
                        checked={variation.is_image_selector || false}
                        onChange={(e) =>
                          updateVariation(
                            index,
                            "is_image_selector",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300"
                      />
                      <label
                        htmlFor={`use-img-${index}`}
                        className="text-sm font-medium text-gray-700 select-none cursor-pointer"
                      >
                        Upload images for each value of this variation? (e.g.
                        Red gets Red images)
                      </label>
                    </div>

                    {/* Render Dropzones per Value if enabled */}
                    {isImageControl && variation.values?.length > 0 && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        <Label>Variation Images</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {variation.values.map((valId) => {
                            const item = availableItems.find(
                              (i) => i.id == valId
                            );
                            if (!item) return null;
                            return (
                              <div
                                key={valId}
                                className="border p-3 rounded bg-white"
                              >
                                <p className="font-medium text-sm mb-2">
                                  {item.name} Images
                                </p>
                                <Dropzone
                                  multiple={true}
                                  maxFiles={12}
                                  onFilesChange={(files) => {
                                    // Store files in a nested structure: variation[index].image_files[valId]
                                    const currentImageFiles =
                                      variation.image_files || {};
                                    updateVariation(index, "image_files", {
                                      ...currentImageFiles,
                                      [valId]: files,
                                    });
                                  }}
                                  // Note: Handling edit mode initial files for variations is tricky without known structure
                                  // initialFiles={...}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {variationConfig?.length === 0 && (
                <div className="text-center py-6 text-gray-400 border-2 border-dashed rounded-lg">
                  No variations added.
                </div>
              )}
            </div>
          </ComponentCard>
        )}

        <div className="mt-8 flex gap-4">
          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Submit"}
          </PrimaryButton>
          <PrimaryButton
            variant="secondary"
            type="button"
            onClick={() => navigate("/merchant/product/all-products")}
          >
            Cancel
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
