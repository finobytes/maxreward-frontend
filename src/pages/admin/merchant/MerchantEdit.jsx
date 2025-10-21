import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { merchantEditSchema } from "@/schemas/merchantEditSchema";
import {
  useGetMerchantByIdQuery,
  useUpdateMerchantMutation,
} from "@/redux/features/admin/merchantManagement/merchantManagementApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Dropzone from "@/components/form/form-elements/Dropzone";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

const MerchantEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load existing merchant data by ID
  const {
    data: merchantData,
    isFetching,
    isError,
  } = useGetMerchantByIdQuery(id, {
    skip: !id,
  });

  const [updateMerchant, { isLoading }] = useUpdateMerchantMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(merchantEditSchema),
  });

  // Populate existing merchant data into form
  useEffect(() => {
    if (merchantData?.data) {
      reset(merchantData.data);
    }
  }, [merchantData, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      delete payload.confirm_password;

      if (!payload.merchant_password) {
        delete payload.merchant_password;
      }

      await updateMerchant({ id, ...payload }).unwrap();

      toast.success("Merchant updated successfully!");
      navigate("/admin/merchant/all-merchant");
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Failed to update merchant!");
    }
  };

  if (isFetching)
    return (
      <div className="p-6 space-y-4">
        {/* Skeleton for breadcrumb */}
        <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>

        {/* Skeleton for cards */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-white rounded shadow">
              <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, j) => (
                  <div
                    key={j}
                    className="h-10 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (isError)
    return <p className="p-6 text-red-500">Failed to load merchant data.</p>;

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Merchant", to: "/admin/merchant/all-merchant" },
          { label: "Edit Merchant" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Member Information */}
        <ComponentCard title="Member Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <Label>Business Name</Label>
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
                <Label>Business Type</Label>
                <Select
                  {...register("business_type")}
                  options={[
                    { value: "Retail", label: "Retail" },
                    { value: "Service", label: "Service" },
                    { value: "Super Shop", label: "Super Shop" },
                  ]}
                />
                {errors.business_type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_type.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Business Description</Label>
                <Input
                  {...register("business_description")}
                  placeholder="Business Description"
                />
              </div>

              <div>
                <Label>Company Address</Label>
                <Input
                  {...register("company_address")}
                  placeholder="Company Address"
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  {...register("status")}
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "approved", label: "Approved" },
                    { value: "rejected", label: "Rejected" },
                  ]}
                />
              </div>

              <div>
                <Label>License Number</Label>
                <Input
                  {...register("license_number")}
                  placeholder="License Number"
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <Label>Upload Company Logo</Label>
              <Dropzone />
            </div>
          </div>
        </ComponentCard>

        {/* Bank Information */}
        <div className="mt-6">
          <ComponentCard title="Bank Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Bank Name</Label>
                <Input {...register("bank_name")} placeholder="Bank Name" />
              </div>
              <div>
                <Label>Account Holder Name</Label>
                <Input
                  {...register("account_holder_name")}
                  placeholder="Account Holder Name"
                />
              </div>
              <div>
                <Label>Account Number / IBAN</Label>
                <Input
                  {...register("account_number")}
                  placeholder="Account Number"
                />
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Owner Information */}
        <div className="mt-6">
          <ComponentCard title="Owner Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Owner Name</Label>
                <Input {...register("owner_name")} placeholder="Owner Name" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input {...register("phone")} placeholder="Phone Number" />
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  {...register("gender")}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input {...register("address")} placeholder="Full Address" />
              </div>
              <div>
                <Label>Email</Label>
                <Input {...register("email")} placeholder="Email" />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Merchant"}
              </PrimaryButton>
              <PrimaryButton
                variant="secondary"
                type="button"
                onClick={() => navigate(-1)}
              >
                Back
              </PrimaryButton>
            </div>
          </ComponentCard>
        </div>
      </form>
    </div>
  );
};

export default MerchantEdit;
