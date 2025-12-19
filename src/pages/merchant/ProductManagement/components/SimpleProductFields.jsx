import React from "react";
import { useFormContext } from "react-hook-form";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";

const SimpleProductFields = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-down">
      <div>
        <Label htmlFor="regular_price">Regular Price (RM)*</Label>
        <Input
          type="number"
          step="0.01"
          {...register("regular_price")}
          error={!!errors.regular_price}
          hint={errors.regular_price?.message}
        />
      </div>
      <div>
        <Label htmlFor="regular_point">Regular Point*</Label>
        <Input
          type="number"
          step="0.01"
          {...register("regular_point")}
          error={!!errors.regular_point}
          hint={errors.regular_point?.message}
        />
      </div>
      <div>
        <Label htmlFor="unit_weight">Unit Weight (kg)</Label>
        <Input type="number" step="0.01" {...register("unit_weight")} />
      </div>
      <div>
        <Label htmlFor="sale_price">Sale Price (RM)</Label>
        <Input type="number" step="0.01" {...register("sale_price")} />
      </div>
      <div>
        <Label htmlFor="sale_point">Sale Point</Label>
        <Input type="number" step="0.01" {...register("sale_point")} />
      </div>
      <div>
        <Label htmlFor="cost_price">Cost Price (RM)</Label>
        <Input type="number" step="0.01" {...register("cost_price")} />
      </div>
    </div>
  );
};

export default SimpleProductFields;
