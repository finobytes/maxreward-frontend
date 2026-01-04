import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import Input from "../../../../components/form/input/InputField";
import { generateEAN13 } from "../../../../utils/eanGenerator";

const SimpleProductTable = ({ rmPoints, handleSkuValidation }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

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

  // Generate EAN if missing
  const eanNo = watch("ean_no");
  useEffect(() => {
    if (!eanNo) {
      const newEan = generateEAN13();
      setValue("ean_no", newEan);
    }
  }, [eanNo, setValue]);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
              SKU
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
              EAN
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
              Regular Price (RM)*
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
              Regular Point*
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
              Sell Price (RM)
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
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
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
              Unit Weight (kg)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr className="hover:bg-gray-50 transition-colors">
            {/* SKU */}
            <td className="px-3 py-2 align-top">
              <Input
                className="h-9 text-xs min-w-[140px]"
                {...register("sku_short_code", {
                  onChange: (e) => {
                    const val = e.target.value.replace(/\s+/g, "-");
                    e.target.value = val;
                    setValue("sku_short_code", val);
                  },
                })}
                onBlur={(e) =>
                  handleSkuValidation && handleSkuValidation(e.target.value)
                }
                placeholder="SKU"
                error={!!errors.sku_short_code}
                hint={errors.sku_short_code?.message}
              />
            </td>

            {/* EAN (Auto-generated, Read-only as per "auto generated" hint, but usually editable too? User said "auto generated", let's make it readonly-ish or just prefilled ?) 
                User said "for simple product show an not editable table row" -> wait, "not editable table row"? 
                OR "show an not editable table row" IS THE REQUEST?
                "for simple product show an not editable table row. this row contain SKU... EAN auto generated"
                Usually "not editable" means the row structure is fixed, but inputs are editable? 
                "show an not editable table row" -> Maybe they mean the row itself isn't deletable? 
                But then "this row contain SKU...". 
                "EAN auto generated" -> Implies EAN field is auto filled.
                I will make fields editable inputs, because user needs to enter Price, Qty etc. 
                If the *entire row* was not editable, how would they enter price? 
                I think "not editable table row" means "a single static row that cannot be added/removed like variations".
            */}
            <td className="px-3 py-2 align-top">
              <Input
                className="h-9 text-xs min-w-[140px] bg-gray-50"
                {...register("ean_no")}
                placeholder="EAN"
                readOnly
                error={!!errors.ean_no}
              />
            </td>

            {/* Regular Price */}
            <td className="px-3 py-2 align-top">
              <Input
                className="h-9 text-xs min-w-[100px]"
                type="text"
                {...registerWithPoints("regular_price", "regular_point")}
                placeholder="0.00"
                error={!!errors.regular_price}
                hint={errors.regular_price?.message}
              />
            </td>

            {/* Regular Point */}
            <td className="px-3 py-2 align-top">
              <Input
                className="h-9 text-xs min-w-[100px]"
                type="text"
                {...registerNumber("regular_point")}
                placeholder="0"
                error={!!errors.regular_point}
                hint={errors.regular_point?.message}
              />
            </td>

            {/* Sell Price */}
            <td className="px-3 py-2 align-top">
              <Input
                className="h-9 text-xs min-w-[100px]"
                type="text"
                {...registerWithPoints("sale_price", "sale_point")}
                placeholder="0.00"
              />
            </td>

            {/* Sell Point */}
            <td className="px-3 py-2 align-top">
              <Input
                className="h-9 text-xs min-w-[100px]"
                type="text"
                {...registerNumber("sale_point")}
                placeholder="0"
              />
            </td>

            {/* Actual Quantity */}
            <td className="px-3 py-2 align-top">
              <Input
                className="h-9 text-xs min-w-[80px]"
                type="text"
                {...registerNumber("actual_quantity")}
                placeholder="0"
                error={!!errors.actual_quantity}
                hint={errors.actual_quantity?.message}
              />
            </td>

            {/* Cost Price */}
            <td className="px-3 py-2 align-top">
              <Input
                className="h-9 text-xs min-w-[80px]"
                type="text"
                {...registerNumber("cost_price")}
                placeholder="0.00"
              />
            </td>

            {/* Low Stock Threshold */}
            <td className="px-3 py-2 align-top">
              <Input
                className="h-9 text-xs min-w-[80px]"
                type="text"
                {...registerNumber("low_stock_threshold")}
                placeholder="0"
              />
            </td>

            {/* Unit Weight */}
            <td className="px-3 py-2 align-top">
              <Input
                className="h-9 text-xs min-w-[80px]"
                type="text"
                {...registerNumber("unit_weight")}
                placeholder="0.00"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SimpleProductTable;
