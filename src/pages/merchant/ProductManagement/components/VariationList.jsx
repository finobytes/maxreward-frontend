import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Dropzone from "../../../../components/form/form-elements/Dropzone";

const VariationList = ({ variationFields, removeVariation, isEditMode }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  if (!variationFields || variationFields.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Variations ({variationFields.length})
        </h3>
        <span className="text-sm text-gray-500">
          Configure price and stock for each variation
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {variationFields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            {/* Header of Card */}
            <div className="bg-gray-50 px-5 py-3 border-b flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded text-xs uppercase tracking-wider">
                    #{index + 1}
                  </span>
                  {field.formatted_attributes || "Variation"}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">
                  SKU: {field.sku}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeVariation(index)}
                className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline"
              >
                Remove
              </button>
            </div>

            {/* Body of Card */}
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <Label className="text-xs">Regular Price*</Label>
                  <Input
                    className="h-9 text-sm"
                    {...register(`variations.${index}.regular_price`)}
                    placeholder="0.00"
                    error={!!errors.variations?.[index]?.regular_price}
                  />
                </div>
                <div>
                  <Label className="text-xs">Regular Point*</Label>
                  <Input
                    className="h-9 text-sm"
                    {...register(`variations.${index}.regular_point`)}
                    placeholder="0"
                    error={!!errors.variations?.[index]?.regular_point}
                  />
                </div>
                <div>
                  <Label className="text-xs">Stock Quantity*</Label>
                  <Input
                    className="h-9 text-sm"
                    {...register(`variations.${index}.actual_quantity`)}
                    placeholder="0"
                    error={!!errors.variations?.[index]?.actual_quantity}
                  />
                </div>
                <div>
                  <Label className="text-xs">Sale Price</Label>
                  <Input
                    className="h-9 text-sm"
                    {...register(`variations.${index}.sale_price`)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-lg p-3 border border-dashed border-gray-300">
                <Label className="mb-2 text-xs text-gray-500">
                  Variation Specific Images
                </Label>
                <Controller
                  control={control}
                  name={`variations.${index}.images`}
                  render={({ field: { onChange, value } }) => (
                    <Dropzone
                      multiple={true}
                      maxFiles={5}
                      onFilesChange={onChange}
                      initialFiles={isEditMode && value ? value : []}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariationList;
