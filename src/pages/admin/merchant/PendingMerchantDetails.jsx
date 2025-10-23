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

const PendingMerchantDetails = () => {
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
      //   navigate("/admin/merchant/all-merchant");
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
          { label: "Pending Merchant", to: "/admin/merchant/pending-merchant" },
          { label: "Merchant Application Form" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Business Information */}
        <ComponentCard title="Business Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={merchantData?.business_name}
                  placeholder="Business name"
                  readOnly
                />
              </div>
              <div>
                <Label>Company Address</Label>
                <Input
                  value={merchantData?.company_address}
                  placeholder="Company Address"
                  readOnly
                />
              </div>

              <div>
                <Label>State</Label>
                <Input placeholder="N/A" readOnly />
              </div>
              <div>
                <Label>Product / Service</Label>
                <Input
                  value={merchantData?.business_type}
                  placeholder="N/A"
                  readOnly
                />
              </div>
              <div>
                <Label>Annual Sales Turnover</Label>
                <Input placeholder="N/A" readOnly />
              </div>
              <div>
                <Label>Reward Budget (%)</Label>
                <Input placeholder="N/A" readOnly />
              </div>
            </div>

            <div className="md:col-span-1">
              <Label>Upload Company Logo</Label>
              <Dropzone />
            </div>
          </div>
        </ComponentCard>

        {/* Authorized Person Information */}
        <div className="mt-6">
          <ComponentCard title="Authorized Person Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Authorized Person Name</Label>
                <Input placeholder="N/A" readOnly />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="N/A" />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input placeholder="N/A" />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <PrimaryButton
                variant="success"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Approving..." : "Approve"}
              </PrimaryButton>
              <PrimaryButton
                variant="danger"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Rejecting..." : "Reject"}
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

export default PendingMerchantDetails;
