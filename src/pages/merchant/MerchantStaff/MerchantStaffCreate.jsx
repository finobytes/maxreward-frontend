import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Select from "@/components/form/Select";
import { merchantStaffSchema } from "../../../schemas/merchantStaffSchema";
import { useCreateStaffMutation } from "../../../redux/features/merchant/merchantStaff/merchantStaffApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const MerchantStaffCreate = () => {
  const [createStaff, { isLoading }] = useCreateStaffMutation();
  const { user } = useSelector((state) => state.auth); //  current merchant
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(merchantStaffSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      gender_type: "male",
      status: "active",
      town: "",
      country_code: "",
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
        town: formData.town,
        country_code: formData.country_code,
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
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Merchant Staff", to: "/merchant/merchant-staff" },
          { label: "Create New Staff" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentCard title="Staff Information">
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
              <PhoneInput
                country={"my"}
                value={watch("phone")}
                onChange={(phone, countryData) => {
                  const numeric = phone.replace("+", "");
                  setValue("phone", numeric);
                  setValue("country_code", countryData?.dialCode);
                }}
                inputProps={{
                  name: "phone",
                  required: true,
                }}
                countryCodeEditable={false}
                enableSearch={true}
                autocompleteSearch={true}
                searchPlaceholder="search"
                prefix=""
                inputStyle={{ width: "100%" }}
                buttonStyle={{}}
                dropdownStyle={{ maxHeight: "250px" }}
                searchStyle={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
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

            {/* Town */}
            <div>
              <Label htmlFor="town">Town</Label>
              <Input
                type="text"
                id="town"
                placeholder="Enter town"
                {...register("town")}
                error={!!errors.town}
                hint={errors.town?.message}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Submit"}
            </PrimaryButton>
            <PrimaryButton variant="secondary" type="button">
              Back
            </PrimaryButton>
          </div>
        </ComponentCard>
      </form>
    </div>
  );
};

export default MerchantStaffCreate;
