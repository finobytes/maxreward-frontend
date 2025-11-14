import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateMerchantMutation } from "@/redux/features/admin/merchantManagement/merchantManagementApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Dropzone from "@/components/form/form-elements/Dropzone";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useGetAllBusinessTypesQuery } from "@/redux/features/admin/businessType/businessTypeApi";
import { merchantSchema } from "../../../schemas/merchantSchema";
import { useSelector } from "react-redux";
import { companyLogoPlaceholder } from "../../../assets/assets";

const MerchantRegistrationForm = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  console.log(role);

  const [businessLogo, setBusinessLogo] = useState(null);

  const [createMerchant, { isLoading }] = useCreateMerchantMutation();
  const navigate = useNavigate();
  const {
    data: businessTypes,
    isLoading: isBusinessTypeLoading,
    isError: isBusinessTypeError,
  } = useGetAllBusinessTypesQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      status: "approved",
    },
  });

  const onSubmit = async (data) => {
    try {
      data.merchant_created_by = role === "admin" ? "admin" : "general_member";
      const formData = new FormData();

      //  Append all text fields
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      //  File append
      if (businessLogo) {
        formData.append("business_logo", businessLogo);
      }

      const response = await createMerchant(formData).unwrap();

      toast.success("Merchant created successfully!");
      reset();
      navigate("/admin/merchant/pending-merchant");
    } catch (err) {
      console.error("Create Error:", err);
      if (err?.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, messages]) => {
          toast.error(`${field}: ${messages.join(", ")}`);
        });
      } else {
        toast.error("Failed to create merchant!");
      }
    }
  };

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Pending Merchant", to: "/admin/merchant/pending-merchant" },
          { label: "Merchant Registration" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Member Information */}
        <ComponentCard title="Business Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <Label>Company Name</Label>
                <Input
                  {...register("business_name")}
                  placeholder="Business name"
                />
                {errors.business_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Company Address</Label>
                <Input {...register("address")} placeholder="Company Address" />
              </div>
              <div>
                <Label>State</Label>
                <Input {...register("state")} placeholder="State" />
              </div>
              <div>
                <Label>Product/Service</Label>

                {isBusinessTypeLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : isBusinessTypeError ? (
                  <p className="text-red-500 text-sm">
                    Failed to load product/service type
                  </p>
                ) : (
                  <Select
                    defaultValue=""
                    {...register("business_type_id")}
                    options={[
                      ...(businessTypes?.data?.business_types?.map((type) => ({
                        value: type.id,
                        label: type.name,
                      })) || []),
                    ]}
                    placeholder="Select Product/Service Type"
                  />
                )}

                {errors.business_type_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_type_id.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Annual Sales Turnover</Label>
                <Input
                  {...register("annual_sales_turnover")}
                  placeholder="Annual Sales Turnover"
                />
              </div>
              <div>
                <Label>Reward Budget (%)</Label>
                <Input
                  {...register("reward_budget")}
                  placeholder="Reward Budget (%)"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  {...register("merchant_password")}
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <Label>Upload Company Logo</Label>
              <Dropzone
                multiple={false}
                maxFileSizeMB={5}
                required
                validationMessage="Company logo is required"
                placeholderImage={companyLogoPlaceholder}
                onFilesChange={(file) => setBusinessLogo(file ?? null)}
              />
            </div>
          </div>
        </ComponentCard>

        {/* Bank Information */}
        <div className="mt-6">
          <ComponentCard title="Authorized Person Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Authorized Person Name</Label>
                <Input
                  {...register("authorized_person_name")}
                  placeholder="Authorized Person Name"
                />
              </div>
              <div>
                <Label>
                  Phone Number (<span className="text-red-500">*</span>)
                </Label>
                <Input {...register("phone")} placeholder="Phone Number" />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Email Address</Label>
                <Input {...register("email")} placeholder="Email Address" />
              </div>

              <div>
                <Label>Designation</Label>
                <Input {...register("designation")} placeholder="Designation" />
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </PrimaryButton>
              <PrimaryButton
                variant="secondary"
                type="button"
                onClick={() => reset()}
              >
                Reset
              </PrimaryButton>
            </div>
          </ComponentCard>
        </div>
      </form>
    </div>
  );
};

export default MerchantRegistrationForm;
