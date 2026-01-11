import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Input from "../../../../components/form/input/InputField";
import { Trash, Image as ImageIcon } from "lucide-react";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../../../components/ui/dialog";

const VariationList = ({
  variationFields,
  removeVariation,
  rmPoints,
  isEditMode,
}) => {
  const [selected, setSelected] = useState([]);
  const [isBulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkEditField, setBulkEditField] = useState("");
  const [bulkEditValue, setBulkEditValue] = useState("");

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  if (!variationFields || variationFields.length === 0) return null;
  const toggleSelectAll = (checked) => {
    setSelected(checked ? variationFields.map((v) => v.id) : []);
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkEdit = (field) => {
    setBulkEditField(field);
    setBulkEditValue("");
    setBulkEditOpen(true);
  };

  const applyBulkEdit = () => {
    variationFields.forEach((field, index) => {
      if (selected.includes(field.id)) {
        setValue(`variations.${index}.${bulkEditField}`, bulkEditValue, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
    setBulkEditOpen(false);
    setBulkEditValue("");
    setBulkEditField("");
  };

  const handleBulkValueChange = (e) => {
    let val = e.target.value;
    // Allow numbers and one decimal point
    val = val.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) {
      const parts = val.split(".");
      val = parts.shift() + "." + parts.join("");
    }
    setBulkEditValue(val);
  };

  const getBulkEditTitle = () => {
    switch (bulkEditField) {
      case "actual_quantity":
        return "Actual Quantity";
      case "cost_price":
        return "Cost Price";
      case "low_stock_threshold":
        return "Low Quantity Threshold";
      default:
        return "Bulk Edit";
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      {selected.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 bg-gray-50 p-3 rounded-md border">
          <p className="text-sm text-gray-700">{selected.length} selected</p>

          {!isEditMode && (
            <>
              <PrimaryButton
                variant="primary"
                size="sm"
                onClick={() => handleBulkEdit("actual_quantity")}
              >
                Actual Qty
              </PrimaryButton>
              <PrimaryButton
                variant="primary"
                size="sm"
                onClick={() => handleBulkEdit("cost_price")}
              >
                Cost Price
              </PrimaryButton>
              <PrimaryButton
                variant="primary"
                size="sm"
                onClick={() => handleBulkEdit("low_stock_threshold")}
              >
                Low Qty
              </PrimaryButton>
            </>
          )}
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {!isEditMode && (
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={
                    variationFields.length > 0 &&
                    selected.length === variationFields.length
                  }
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
              </th>
            )}
            {isEditMode && (
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[60px]">
                Image
              </th>
            )}
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
              Regular Price (RM)*
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Regular Point*
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Sell Price (RM)
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Sell Point
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Actual Qty
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Cost Price
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Low Qty
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Unit Weight (kg)
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {variationFields.map((field, index) => {
            // Helper for number validation and auto-calc
            const handleNumberChange = (e, onChange, pointName = null) => {
              let val = e.target.value;
              val = val.replace(/[^0-9.]/g, "");
              if ((val.match(/\./g) || []).length > 1) {
                const parts = val.split(".");
                val = parts.shift() + "." + parts.join("");
              }
              e.target.value = val;
              onChange(e);

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
              <tr key={field.id} className="hover:bg-gray-50 transition-colors">
                {!isEditMode && (
                  <td className="px-3 py-4 text-sm text-gray-900 align-top">
                    <input
                      type="checkbox"
                      checked={selected.includes(field.id)}
                      onChange={() => toggleSelect(field.id)}
                      className="w-4 h-4 rounded"
                    />
                  </td>
                )}
                {isEditMode && (
                  <td className="px-3 py-4 text-sm text-gray-900 align-top">
                    <div className="h-10 w-10 border rounded bg-white overflow-hidden flex items-center justify-center">
                      {field.images?.[0]?.url ? (
                        <img
                          src={field.images[0].url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={14} className="text-gray-300" />
                      )}
                    </div>
                  </td>
                )}
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
                    type="text"
                    {...registerWithPoints(
                      `variations.${index}.regular_price`,
                      `variations.${index}.regular_point`
                    )}
                    placeholder="0.00"
                    error={!!errors.variations?.[index]?.regular_price}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    className="h-9 text-xs min-w-[80px]"
                    type="text"
                    {...registerNumber(`variations.${index}.regular_point`)}
                    placeholder="0"
                    error={!!errors.variations?.[index]?.regular_point}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    className="h-9 text-xs min-w-[80px]"
                    type="text"
                    {...registerWithPoints(
                      `variations.${index}.sale_price`,
                      `variations.${index}.sale_point`
                    )}
                    placeholder="0.00"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    className="h-9 text-xs min-w-[80px]"
                    type="text"
                    {...registerNumber(`variations.${index}.sale_point`)}
                    placeholder="0"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    className="h-9 text-xs min-w-[80px]"
                    type="text"
                    {...registerNumber(`variations.${index}.actual_quantity`)}
                    placeholder="0"
                    error={!!errors.variations?.[index]?.actual_quantity}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    className="h-9 text-xs min-w-[80px]"
                    type="text"
                    {...registerNumber(`variations.${index}.cost_price`)}
                    placeholder="0.00"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    className="h-9 text-xs min-w-[80px]"
                    type="text"
                    {...registerNumber(
                      `variations.${index}.low_stock_threshold`
                    )}
                    placeholder="0"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    className="h-9 text-xs min-w-[80px]"
                    type="text"
                    {...registerNumber(`variations.${index}.unit_weight`)}
                    placeholder="0.00"
                  />
                </td>
                <td className="px-3 py-2 text-center align-top">
                  <button
                    type="button"
                    onClick={() => removeVariation(index)}
                    disabled={!!field.variation_id}
                    className={`p-2 rounded-full transition-colors ${
                      field.variation_id
                        ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700 bg-red-200 hover:bg-red-300"
                    }`}
                    title={
                      field.variation_id
                        ? "Existing variations cannot be removed"
                        : "Remove Variation"
                    }
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Dialog open={isBulkEditOpen} onOpenChange={setBulkEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Add {getBulkEditTitle()}</DialogTitle>
            <DialogDescription>
              Enter the value to apply to all selected variations.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="bulk-value" className="sr-only">
                Value
              </Label>
              <Input
                id="bulk-value"
                value={bulkEditValue}
                onChange={handleBulkValueChange}
                placeholder={`Enter ${getBulkEditTitle()}`}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setBulkEditOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={applyBulkEdit}>
              Apply to {selected.length} items
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VariationList;
