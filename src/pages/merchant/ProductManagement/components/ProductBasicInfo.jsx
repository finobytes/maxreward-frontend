import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";

const ProductBasicInfo = ({
  handleSkuValidation,
  brands = [],
  categories = [],
  subCategories = [],
  genders = [],
  models = [],
  rmPoints,
  productType,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedCategoryId = watch("category_id");

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category_id == selectedCategoryId
  );

  const handleNumberChange = (e, onChange, pointName = null) => {
    let val = e.target.value;
    // Allow digits and single decimal point
    val = val.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) {
      const parts = val.split(".");
      val = parts.shift() + "." + parts.join("");
    }

    e.target.value = val;
    onChange(e);

    // Point Calculation
    if (pointName && rmPoints) {
      const numVal = parseFloat(val);
      if (!isNaN(numVal)) {
        setValue(pointName, (numVal * rmPoints).toFixed(2));
      } else if (val === "") {
        setValue(pointName, "");
      }
    }
  };

  const registerWithPoints = (name, pointName) => {
    const { onChange, ...rest } = register(name);
    return {
      ...rest,
      onChange: (e) => handleNumberChange(e, onChange, pointName),
    };
  };

  const registerNumber = (name) => {
    const { onChange, ...rest } = register(name);
    return {
      ...rest,
      onChange: (e) => handleNumberChange(e, onChange),
    };
  };

  return (
    <ComponentCard title="Product Information">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Product Name */}
        <div className="md:col-span-3">
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

        {/* 2. Brand */}
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

        {/* 3. Category */}
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

        {/* Sub Category - Conditional */}
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

        {/* 4. Gender */}
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

        {/* 5. Model */}
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

        {/* 6. SKU Short Code */}
        <div>
          <Label htmlFor="sku_short_code">SKU Short Code</Label>
          <Input
            type="text"
            id="sku_short_code"
            placeholder="e.g. TSHIRT"
            {...register("sku_short_code")}
            onBlur={(e) =>
              handleSkuValidation && handleSkuValidation(e.target.value)
            }
            error={!!errors.sku_short_code}
            hint={errors.sku_short_code?.message}
          />
        </div>

        {/* 7. Description */}
        <div className="md:col-span-3">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            placeholder="Enter product description"
            {...register("description")}
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
            rows={4}
          />
        </div>

        {/* 8. Regular Price */}
        <div>
          <Label htmlFor="regular_price">Regular Price (RM)*</Label>
          <Input
            type="text"
            {...registerWithPoints("regular_price", "regular_point")}
            error={!!errors.regular_price}
            hint={errors.regular_price?.message}
          />
        </div>

        {/* 9. Regular Point */}
        <div>
          <Label htmlFor="regular_point">Regular Point*</Label>
          <Input
            type="text"
            {...registerNumber("regular_point")}
            error={!!errors.regular_point}
            hint={errors.regular_point?.message}
          />
        </div>

        {/* 10. Sell Price */}
        <div>
          <Label htmlFor="sale_price">Sell Price (RM)</Label>
          <Input
            type="text"
            {...registerWithPoints("sale_price", "sale_point")}
          />
        </div>

        {/* 11. Sell Point */}
        <div>
          <Label htmlFor="sale_point">Sell Point</Label>
          <Input type="text" {...registerNumber("sale_point")} />
        </div>

        {/* 12. Unit Weight */}
        <div>
          <Label htmlFor="unit_weight">Unit Weight (kg)</Label>
          <Input type="text" {...registerNumber("unit_weight")} />
        </div>

        {/* Pricing & Weight - Only for Simple Products */}
        {productType === "simple" && (
          <>
            {/* 13. Actual Quantity */}
            <div>
              <Label htmlFor="actual_quantity">Actual Quantity</Label>
              <Input
                type="text"
                {...registerNumber("actual_quantity")}
                error={!!errors?.actual_quantity}
                hint={errors?.actual_quantity?.message}
              />
            </div>
          </>
        )}
      </div>
    </ComponentCard>
  );
};

export default ProductBasicInfo;
