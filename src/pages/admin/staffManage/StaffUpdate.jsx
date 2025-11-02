import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Dropzone from "../../../components/form/form-elements/Dropzone";

import {
  useGetSingleAdminStaffQuery,
  useUpdateAdminStaffMutation,
} from "../../../redux/features/admin/adminStaff/adminStaffApi";

// Zod Schema (same as Create but password optional)
const adminStaffUpdateSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .regex(
      /^(?:\+?8801[3-9]\d{8}|01[3-9]\d{8}|\+?601[0-9]\d{7,8}|601[0-9]\d{7,8})$/,
      "Phone number must be Bangladeshi or Malaysian"
    ),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
  designation: z.string().min(2, "Designation is required"),
  address: z.string().min(3, "Address is required"),
  gender: z.enum(["male", "female", "others"]),
  status: z.enum(["active", "inactive"]),
});

const StaffUpdate = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [nationalIdCard, setNationalIdCard] = useState([]);
  const [existingProfile, setExistingProfile] = useState([]);
  const [existingNid, setExistingNid] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  // API hooks
  const { data: staffData, isLoading: isFetching } =
    useGetSingleAdminStaffQuery(id);
  const [updateAdminStaff, { isLoading }] = useUpdateAdminStaffMutation();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(adminStaffUpdateSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      designation: "",
      address: "",
      password: "",
      gender: "male",
      status: "active",
    },
  });

  // Prefill form when data arrives
  useEffect(() => {
    if (staffData?.data) {
      const d = staffData.data;
      reset({
        name: d.name || "",
        phone: d.phone || "",
        email: d.email || "",
        designation: d.designation || "",
        address: d.address || "",
        password: "",
        gender: d.gender || "male",
        status: d.status || "active",
      });
      if (d.profile_picture) {
        setExistingProfile([d.profile_picture]);
      }
      if (d.national_id_card && Array.isArray(d.national_id_card)) {
        setExistingNid(d.national_id_card);
      }
    }
  }, [staffData, reset]);

  // Submit handler
  const onSubmit = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("status", formData.status);
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }

      if (profilePicture) {
        formDataToSend.append("profile_picture", profilePicture);
      }

      if (nationalIdCard.length > 0) {
        nationalIdCard.forEach((file, index) => {
          formDataToSend.append(`national_id_card[${index}]`, file);
        });
      }

      const res = await updateAdminStaff({ id, data: formDataToSend }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Admin staff updated successfully!");
        navigate("/admin/staff-manage");
      } else {
        toast.error(res?.message || "Failed to update admin staff");
      }
    } catch (err) {
      console.error("Update Failed:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Skeleton while fetching
  if (isFetching) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
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
  }

  // Main Form UI
  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Staff Manage", to: "/admin/staff-manage" },
          { label: "Update Staff" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentCard title="Update Admin Staff">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                {...register("name")}
                error={!!errors.name}
                hint={errors.name?.message}
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
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
                id="email"
                type="email"
                placeholder="Enter email"
                {...register("email")}
                error={!!errors.email}
                hint={errors.email?.message}
              />
            </div>

            {/* Designation */}
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                placeholder="Enter designation"
                {...register("designation")}
                error={!!errors.designation}
                hint={errors.designation?.message}
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter address"
                {...register("address")}
                error={!!errors.address}
                hint={errors.address?.message}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Leave blank if not changing"
                {...register("password")}
                error={!!errors.password}
                hint={errors.password?.message}
              />
            </div>

            {/* Gender */}
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                {...register("gender")}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "others", label: "Others" },
                ]}
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                {...register("status")}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label>Profile Picture</Label>
              <Dropzone
                onFilesChange={(files) => setProfilePicture(files[0])}
                initialFiles={existingProfile}
              />
            </div>
            <div>
              <Label>National ID</Label>
              <Dropzone
                multiple={true}
                maxFiles={2}
                onFilesChange={(files) => setNationalIdCard(files)}
                initialFiles={existingNid}
              />
            </div>
          </div>

          {/* Buttons */}
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

export default StaffUpdate;
