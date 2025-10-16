import React from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { useCreateStaffMutation } from "../../../redux/features/merchant/merchantStaff/merchantStaffApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { merchantStaffSchema } from "../../../schemas/merchantStaffSchema";
import { toast } from "sonner";
import Label from "../../../components/form/Label";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import PrimaryButton from "../../../components/ui/PrimaryButton";

const MerchantStaffUpdate = () => {
  const [createStaff, { isLoading }] = useCreateStaffMutation();
  const { user } = useSelector((state) => state.auth); //  current merchant
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(merchantStaffSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      gender_type: "male",
      status: "active",
    },
  });

  const onSubmit = async (formData) => {
    try {
      const payload = {
        merchant_id: user?.merchant_id || 2, // Dynamic or fallback
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        gender_type: formData.gender_type,
        status: formData.status,
      };

      console.log(" Payload:", payload); // debug

      const response = await createStaff(payload).unwrap();
      toast.success(" Staff created successfully!");
      console.log(" API Response:", response);

      reset(); // clear form
      navigate("/merchant/merchant-staff"); // redirect after success
    } catch (err) {
      console.error(" Create Failed:", err);
      toast.error(err?.data?.message || "Failed to create staff");
    }
  };
  return (
    <div>
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
                  placeholder="Enter password"
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
              <PrimaryButton variant="secondary" type="button">
                Back
              </PrimaryButton>
            </div>
          </ComponentCard>
        </form>
      </div>
    </div>
  );
};

export default MerchantStaffUpdate;
