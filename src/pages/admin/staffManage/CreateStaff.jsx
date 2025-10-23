import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Select from "@/components/form/Select";
import Dropzone from "../../../components/form/form-elements/Dropzone";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useCreateAdminStaffMutation } from "../../../redux/features/admin/adminStaff/adminStaffApi";

// Schema Validation (Zod)
const adminStaffSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  designation: z.string().min(2, "Designation is required"),
  address: z.string().min(3, "Address is required"),
  gender: z.enum(["male", "female", "others"]),
  status: z.enum(["active", "inactive"]),
});

const CreateAdminStaff = () => {
  const navigate = useNavigate();
  const [createAdminStaff, { isLoading }] = useCreateAdminStaffMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(adminStaffSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      designation: "",
      address: "",
      gender: "male",
      status: "active",
    },
  });

  // ✅ Form Submit
  const onSubmit = async (formData) => {
    try {
      const payload = {
        user_name: `A${Date.now()}`, // unique ID
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        designation: formData.designation,
        gender: formData.gender,
        status: formData.status,
      };

      console.log("Submitting payload:", payload);

      const res = await createAdminStaff(payload).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Admin staff created successfully!");
        reset();
        navigate("/admin/staff-manage");
      } else {
        toast.error(res?.message || "Failed to create admin staff");
      }
    } catch (err) {
      console.error(" Create Failed:", err);
      const validationErrors = err?.data?.errors;
      if (validationErrors) {
        Object.entries(validationErrors).forEach(([field, messages]) =>
          toast.error(`${field}: ${messages.join(", ")}`)
        );
      } else {
        toast.error(err?.data?.message || "Something went wrong!");
      }
    }
  };

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Staff Manage", to: "/admin/staff-manage" },
          { label: "Create Staff" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentCard title="Create New Admin Staff">
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

            {/* Designation */}
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                type="text"
                id="designation"
                placeholder="Enter staff designation"
                {...register("designation")}
                error={!!errors.designation}
                hint={errors.designation?.message}
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                placeholder="Enter staff address"
                {...register("address")}
                error={!!errors.address}
                hint={errors.address?.message}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter password"
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
                  { value: "suspend", label: "Suspend" },
                ]}
              />
            </div>
          </div>

          {/* Optional File Uploads */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label>Profile Picture</Label>
              <Dropzone />
            </div>
            <div>
              <Label>National Registration Identity Card (NRIC)</Label>
              <Dropzone />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Submit"}
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

export default CreateAdminStaff;
