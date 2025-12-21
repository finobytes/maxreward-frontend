import React from "react";
import { useFormContext } from "react-hook-form";
import Input from "../../../../components/form/input/InputField";
import { Trash } from "lucide-react";

const VariationList = ({ variationFields, removeVariation }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  if (!variationFields || variationFields.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
              Variation
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
              SKU
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
              EAN
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Regular Price
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Regular Point
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Sell Price
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Sell Point
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Active Qty
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Cost Price
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Low Qty
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {variationFields.map((field, index) => (
            <tr key={field.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-4 text-sm text-gray-900 align-top">
                <div className="font-medium">
                  {field.attributes
                    ?.map((attr) =>
                      attr.attribute_name && attr.attribute_item_name
                        ? `${attr.attribute_name} -> ${attr.attribute_item_name}`
                        : attr.formatted_attributes
                    )
                    .join(", ") ||
                    field.formatted_attributes ||
                    "Default"}
                </div>
                {/* Hidden input to ensure specific values are registered if updated elsewhere, 
                    though map fields usually populated by useFieldArray. 
                */}
              </td>
              <td className="px-3 py-2 align-top">
                <Input
                  className="h-9 text-xs min-w-[100px]"
                  {...register(`variations.${index}.sku`)}
                  placeholder="SKU"
                  error={!!errors.variations?.[index]?.sku}
                />
              </td>
              <td className="px-3 py-2 align-top">
                <Input
                  className="h-9 text-xs min-w-[100px]"
                  {...register(`variations.${index}.ean_no`)}
                  placeholder="EAN"
                />
              </td>
              <td className="px-3 py-2 align-top">
                <Input
                  className="h-9 text-xs min-w-[80px]"
                  type="number"
                  {...register(`variations.${index}.regular_price`)}
                  placeholder="0.00"
                  error={!!errors.variations?.[index]?.regular_price}
                />
              </td>
              <td className="px-3 py-2 align-top">
                <Input
                  className="h-9 text-xs min-w-[80px]"
                  type="number"
                  {...register(`variations.${index}.regular_point`)}
                  placeholder="0"
                  error={!!errors.variations?.[index]?.regular_point}
                />
              </td>
              <td className="px-3 py-2 align-top">
                <Input
                  className="h-9 text-xs min-w-[80px]"
                  type="number"
                  {...register(`variations.${index}.sale_price`)}
                  placeholder="0.00"
                />
              </td>
              <td className="px-3 py-2 align-top">
                <Input
                  className="h-9 text-xs min-w-[80px]"
                  type="number"
                  {...register(`variations.${index}.sale_point`)}
                  placeholder="0"
                />
              </td>
              <td className="px-3 py-2 align-top">
                <Input
                  className="h-9 text-xs min-w-[80px]"
                  type="number"
                  {...register(`variations.${index}.actual_quantity`)}
                  placeholder="0"
                  error={!!errors.variations?.[index]?.actual_quantity}
                />
              </td>
              <td className="px-3 py-2 align-top">
                <Input
                  className="h-9 text-xs min-w-[80px]"
                  type="number"
                  {...register(`variations.${index}.cost_price`)}
                  placeholder="0.00"
                />
              </td>
              <td className="px-3 py-2 align-top">
                <Input
                  className="h-9 text-xs min-w-[80px]"
                  type="number"
                  {...register(`variations.${index}.low_stock_threshold`)}
                  placeholder="0"
                />
              </td>
              <td className="px-3 py-2 text-center align-top">
                <button
                  type="button"
                  onClick={() => removeVariation(index)}
                  className="text-red-500 hover:text-red-700 p-2 bg-red-200 hover:bg-red-300 rounded-full"
                  title="Remove Variation"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariationList;
