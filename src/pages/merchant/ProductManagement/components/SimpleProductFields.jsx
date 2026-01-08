import React from "react";
import { useFormContext } from "react-hook-form";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";

const SimpleProductFields = ({ rmPoints }) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const registerWithPoints = (name, pointName) => {
    const { onChange, ...rest } = register(name);
    return {
      ...rest,
      onChange: (e) => {
        onChange(e);
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && rmPoints) {
          setValue(pointName, (val * rmPoints).toFixed(2));
        }
      },
    };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-down">
      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input
          type="text"
          placeholder="SKU"
          {...register("sku")}
          error={!!errors.sku}
          hint={errors.sku?.message}
        />
      </div>
      <div>
        <Label htmlFor="variation_regular_price">Regular Price (RM)*</Label>
        <Input
          type="number"
          step="0.01"
          {...registerWithPoints(
            "variation_regular_price",
            "variation_regular_point"
          )}
          error={!!errors.variation_regular_price}
          hint={errors.variation_regular_price?.message}
        />
      </div>
      <div>
        <Label htmlFor="variation_regular_point">Regular Point*</Label>
        <Input
          type="number"
          step="0.01"
          {...register("variation_regular_point")}
          error={!!errors.variation_regular_point}
          hint={errors.variation_regular_point?.message}
        />
      </div>
      <div>
        <Label htmlFor="unit_weight">Unit Weight (kg)</Label>
        <Input type="number" step="0.01" {...register("unit_weight")} />
      </div>
      <div>
        <Label htmlFor="variation_sale_price">Sale Price (RM)</Label>
        <Input
          type="number"
          step="0.01"
          {...registerWithPoints(
            "variation_sale_price",
            "variation_sale_point"
          )}
        />
      </div>
      <div>
        <Label htmlFor="variation_sale_point">Sale Point</Label>
        <Input
          type="number"
          step="0.01"
          {...register("variation_sale_point")}
        />
      </div>
      <div>
        <Label htmlFor="cost_price">Cost Price (RM)</Label>
        <Input type="number" step="0.01" {...register("cost_price")} />
      </div>
      <div>
        <Label htmlFor="actual_quantity">Actual Quantity</Label>
        <Input type="number" {...register("actual_quantity")} />
      </div>
    </div>
  );
};

export default SimpleProductFields;
