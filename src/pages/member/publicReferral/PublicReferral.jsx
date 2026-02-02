import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import SearchableSelect from "@/components/form/SearchableSelect";

import {
  useGetPublicMemberByUsernameQuery,
  useReferNewMemberQrMutation,
} from "../../../redux/features/member/referNewMember/referNewMemberApi";
import { useGetCountriesQuery } from "../../../redux/features/countries/countriesApi";
import { referNewMemberSchema } from "../../../schemas/referNewMember.schema";
import ReferSuccessDialog from "../referNewMember/components/ReferSuccessDialog";
import { Loader2 } from "lucide-react";

const PublicReferral = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [response, setResponse] = useState(null);

  // 1. Try to get referrer from State (internal navigation)
  const stateReferrer = location.state?.referrer;

  // 2. Or try to get from URL (external scan)
  const queryRef = searchParams.get("ref");

  // Fetch if we have a queryRef but no state
  const { data: apiReferrerData, isLoading: isFetchingReferrer } =
    useGetPublicMemberByUsernameQuery(queryRef, {
      skip: !!stateReferrer || !queryRef,
    });

  // The API returns data directly in the response object
  const referrer = stateReferrer || apiReferrerData;
  console.log("stateReferrer", stateReferrer);
  console.log("apiReferrerData", apiReferrerData);
  console.log("referrer", referrer);

  const [referNewMemberQr, { isLoading: loading }] =
    useReferNewMemberQrMutation();
  const { data: countries, isLoading: countriesLoading } =
    useGetCountriesQuery();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(referNewMemberSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      country_id: "84", // Default to Malaysia
      country_code: "",
    },
  });

  // Redirect if no referrer data found
  useEffect(() => {
    if (!referrer && !queryRef && !isFetchingReferrer) {
      // If we're done trying to fetch and still nothing, warn user
      // toast.error("No referrer information found. Please scan a QR code.");
      // navigate("/member/show-qr-code");
    }
  }, [referrer, queryRef, isFetchingReferrer, navigate]);

  useEffect(() => {
    if (!countriesLoading && countries?.data?.length > 0) {
      const malaysia = countries.data.find((c) => c.id === 84);
      if (malaysia) {
        setValue("country_id", String(malaysia.id));
      }
    }
  }, [countriesLoading, countries, setValue]);

  const onSubmit = async (data) => {
    if (!referrer?.id) {
      toast.error("Referrer information is missing.");
      return;
    }

    try {
      // Pass the referrer's Referral Code explicitly
      // If we scanned a code, queryRef is the code.
      // If we navigated internally, we assume referrer.referral_code is available.
      const referralCode =
        queryRef || referrer?.referral_code || referrer?.data?.referral_code;

      const payload = {
        ...data,
        referral_code: referralCode,
      };

      const res = await referNewMemberQr(payload).unwrap();
      setResponse(res);
      setDialogOpen(true);
      reset();
    } catch (err) {
      if (err?.data?.errors) {
        Object.keys(err.data.errors).forEach((key) => {
          setError(key, {
            type: "server",
            message: err.data.errors[key][0],
          });
        });
        toast.error("Validation failed. Please check the form.");
      } else {
        toast.error(err?.data?.message || "Something went wrong");
      }
    }
  };

  if (isFetchingReferrer) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    );
  }

  if (!referrer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-xl font-bold text-gray-800">
          Invalid Referral Link
        </h2>
        <p className="text-gray-500 mt-2">
          We could not identify the referrer. Please request a valid QR code
          from your referrer.
        </p>
        <PrimaryButton className="mt-4" onClick={() => navigate("/login")}>
          Go to Login
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Scan Referral" }]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentCard title="New Member Registration">
          <div className="alert alert-info bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <span className="font-bold text-lg">i</span>
            </div>
            <div>
              You are registering a new member referred by:{" "}
              <span className="font-bold">{referrer?.data?.name}</span> (
              {referrer?.data?.referral_code})
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Nationality */}
            <div>
              <Label htmlFor="citizenship">
                Citizenship <span className="text-red-500">*</span>
              </Label>

              {countriesLoading ? (
                <div className="animate-pulse h-11 bg-gray-200 rounded-lg"></div>
              ) : (
                <Controller
                  name="country_id"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      {...field}
                      onChange={(val) => field.onChange(String(val))}
                      options={
                        countries?.data?.map((item) => ({
                          label: item.country,
                          value: item.id,
                        })) ?? []
                      }
                    />
                  )}
                />
              )}

              {errors.country_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country_id.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phoneNumber">
                Phone Number (<span className="text-red-500">*</span>)
              </Label>
              <PhoneInput
                country={"my"}
                value={watch("phone")}
                onChange={(phone, countryData) => {
                  const numeric = phone.replace("+", "");
                  setValue("phone", numeric);
                  setValue("country_code", countryData?.dialCode);
                }}
                inputProps={{
                  name: "phoneNumber",
                  required: true,
                }}
                countryCodeEditable={false}
                enableSearch={true}
                autocompleteSearch={true}
                searchPlaceholder="search"
                prefix=""
                inputStyle={{ width: "100%" }}
                searchStyle={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />

              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">
                Full Name (<span className="text-red-500">*</span>)
              </Label>
              <Input
                id="fullName"
                placeholder="Enter member full name"
                {...register("name")}
                error={!!errors.name}
                hint={errors.name?.message}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="Enter email"
                {...register("email")}
                error={!!errors.email}
                hint={errors.email?.message}
              />
            </div>
          </div>
        </ComponentCard>

        {/* Read-Only Referral Info */}
        <ComponentCard className="mt-6" title="Referral Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Referred By Name</Label>
              <Input disabled value={referrer?.data?.name || ""} readOnly />
            </div>
            <div>
              <Label>Referral Code</Label>
              <Input
                disabled
                value={referrer?.data?.referral_code || ""}
                readOnly
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Registration"}
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
      </form>

      <ReferSuccessDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          // Navigate to login so the new user can use their credentials
          navigate("/login");
        }}
        response={response}
      />
    </div>
  );
};

export default PublicReferral;
