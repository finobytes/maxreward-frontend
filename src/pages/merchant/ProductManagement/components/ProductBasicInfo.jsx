import React from "react";
import { useFormContext } from "react-hook-form";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";

const ProductBasicInfo = ({ handleSkuValidation }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <ComponentCard title="Basic Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
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

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            placeholder="Enter product description"
            {...register("description")}
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
            rows={4}
          />
        </div>
      </div>
    </ComponentCard>
  );
};

export default ProductBasicInfo;
