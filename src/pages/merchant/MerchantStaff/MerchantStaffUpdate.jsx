import React, { useEffect } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import {
  useUpdateStaffMutation,
  useGetStaffByIdQuery,
} from "../../../redux/features/merchant/merchantStaff/merchantStaffApi";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Label from "../../../components/form/Label";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { merchantStaffUpdateSchema } from "../../../schemas/merchantStaffUpdateSchema";

const MerchantStaffUpdate = () => {
  const { id } = useParams(); // get staff id from URL
  const navigate = useNavigate();

  // API hooks
  const { data: staffData, isLoading: isFetching } = useGetStaffByIdQuery(id);
  const [updateStaff, { isLoading }] = useUpdateStaffMutation();

  // form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(merchantStaffUpdateSchema),
  });

  // populate form when staff data is loaded
  useEffect(() => {
    if (staffData?.data) {
      reset({
        name: staffData.data.name || "",
        phone: staffData.data.phone || "",
        email: staffData.data.email || "",
        password: "", // keep empty for security, unless backend requires it
        gender_type: staffData.data.gender_type || "male",
        status: staffData.data.status || "active",
      });
    }
  }, [staffData, reset]);

  const onSubmit = async (formData) => {
    try {
      const payload = { id, ...formData };

      console.log("Update Payload:", payload);

      const response = await updateStaff(payload).unwrap();
      toast.success("Staff updated successfully!");
      console.log("API Response:", response);

      navigate("/merchant/merchant-staff");
    } catch (err) {
      console.error("Update Failed:", err);
      toast.error(err?.data?.message || "Failed to update staff");
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

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Merchant Staff", to: "/merchant/merchant-staff" },
          { label: "Update Merchant Staff" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentCard title="Update Merchant Staff">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Enter staff full name"
                {...register("name")}
                error={!!errors.name}
                hint={errors.name?.message}
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="text"
                id="phone"
                placeholder="Enter phone number"
                {...register("phone")}
                error={!!errors.phone}
                hint={errors.phone?.message}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter email"
                {...register("email")}
                error={!!errors.email}
                hint={errors.email?.message}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="text"
                id="password"
                placeholder="Leave blank if not changing"
                {...register("password")}
                error={!!errors.password}
                hint={errors.password?.message}
              />
            </div>

            {/* Gender */}
            <div>
              <Label>Gender</Label>
              <Select
                {...register("gender_type")}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "others", label: "Others" },
                ]}
              />
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <Select
                {...register("status")}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Staff"}
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
      </form>
    </div>
  );
};

export default MerchantStaffUpdate;
