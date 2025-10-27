import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Dropzone from "@/components/form/form-elements/Dropzone";
import {
  useGetCompanyDetailsQuery,
  useUpdateCompanyInfoMutation,
  useGetCrPointsQuery,
  useAdjustCrPointsMutation,
} from "@/redux/features/admin/companyInfo/companyInfoApi";
import { Loader } from "lucide-react";

const CompanyInfo = () => {
  const [logoFile, setLogoFile] = useState(null);

  const { data: company, isFetching, isError } = useGetCompanyDetailsQuery();
  const { data: crPointsData } = useGetCrPointsQuery();
  const [updateCompany, { isLoading: isUpdating }] =
    useUpdateCompanyInfoMutation();
  const [adjustCrPoints, { isLoading: isAdjusting }] =
    useAdjustCrPointsMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load data into form
  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        address: company.address,
        phone: company.phone,
        email: company.email,
        logo: company.logo,
      });
    }
  }, [company, reset]);

  // Update company info
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await updateCompany(formData).unwrap();
      toast.success("Company info updated successfully!");
    } catch (err) {
      toast.error("Failed to update company info!");
      console.error(err);
    }
  };

  // Adjust CR Points
  const handleCrAdjustment = async (type) => {
    const amount = prompt(`Enter amount to ${type}:`);
    if (!amount) return;
    try {
      await adjustCrPoints({
        amount: Number(amount),
        type,
        reason:
          type === "increment"
            ? "Manual increment from admin panel"
            : "Manual deduction from admin panel",
      }).unwrap();
      toast.success(
        `Points ${type === "increment" ? "added" : "deducted"} successfully!`
      );
    } catch {
      toast.error("Failed to adjust CR points.");
    }
  };

  if (isFetching)
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader className="animate-spin text-gray-500 w-6 h-6" />
        <span className="ml-2 text-gray-600">Loading company info...</span>
      </div>
    );

  if (isError)
    return (
      <div className="p-6 text-red-500 text-center">
        Failed to load company information.
      </div>
    );

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Company Information" }]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentCard title="Company Details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <Label>Company Name</Label>
                <Input {...register("name")} placeholder="Company name" />
              </div>
              <div>
                <Label>Address</Label>
                <Input {...register("address")} placeholder="Address" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input {...register("phone")} placeholder="Phone number" />
              </div>
              <div>
                <Label>Email</Label>
                <Input {...register("email")} placeholder="Email address" />
              </div>
            </div>

            <div className="md:col-span-1">
              <Label>Company Logo</Label>
              <Dropzone onFilesChange={(files) => setLogoFile(files[0])} />

              {/* {company?.logo && (
                <img
                  src={company.logo}
                  alt="Company Logo"
                  className="mt-3 w-24 h-24 object-cover rounded border"
                />
              )} */}
            </div>
          </div>

          <div className="mt-6">
            <PrimaryButton type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Company Info"}
            </PrimaryButton>
          </div>
        </ComponentCard>

        <ComponentCard className="mt-6" title="Company Reserved Points">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div>
              <Label>Current CR Points</Label>
              <Input
                value={crPointsData?.cr_points ?? company?.cr_points ?? 0}
                readOnly
              />
            </div>

            <div className="flex gap-3 mt-4 sm:mt-7">
              <PrimaryButton
                type="button"
                variant="primary"
                onClick={() => handleCrAdjustment("increment")}
                disabled={isAdjusting}
              >
                Add Points
              </PrimaryButton>
              <PrimaryButton
                type="button"
                variant="secondary"
                onClick={() => handleCrAdjustment("decrement")}
                disabled={isAdjusting}
              >
                Deduct Points
              </PrimaryButton>
            </div>
          </div>
        </ComponentCard>
      </form>
    </div>
  );
};

export default CompanyInfo;
