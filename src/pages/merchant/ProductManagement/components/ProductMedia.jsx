import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Dropzone from "../../../../components/form/form-elements/Dropzone";

const ProductMedia = ({ initialFiles = [] }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <ComponentCard title="Product Media">
      <div className="space-y-2">
        <Label>General Images</Label>
        <p className="text-sm text-gray-500 mb-2">
          Upload general images for the product. Variation-specific images can
          be added later.
        </p>
        <Controller
          control={control}
          name="images"
          render={({ field: { onChange } }) => (
            <Dropzone
              multiple={true}
              maxFiles={12}
              onFilesChange={onChange}
              initialFiles={initialFiles}
              validationMessage={errors.images?.message}
            />
          )}
        />
      </div>
    </ComponentCard>
  );
};

export default ProductMedia;
