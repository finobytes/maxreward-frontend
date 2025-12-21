import React from "react";
import { useFormContext } from "react-hook-form";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";

const ProductMedia = ({ initialFiles = [] }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <ComponentCard title="Product Media">
      <div className="space-y-2">
        <Label>General Images</Label>
        <p className="text-sm text-gray-500 mb-2">
          Upload general images for the product.
        </p>

        <input
          type="file"
          multiple
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-brand-50 file:text-brand-700
            hover:file:bg-brand-100
          "
          {...register("images")}
        />
        {errors.images && (
          <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
        )}
      </div>
    </ComponentCard>
  );
};

export default ProductMedia;
