import React from "react";
import { useFormContext } from "react-hook-form";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Select from "@/components/form/Select";

const ProductOrganization = ({
  brands,
  categories,
  subCategories,
  genders,
  models,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedCategoryId = watch("category_id");

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category_id == selectedCategoryId
  );

  return (
    <ComponentCard title="Organization">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* SubCategory - Conditionally Rendered */}
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
      </div>
    </ComponentCard>
  );
};

export default ProductOrganization;
