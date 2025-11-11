import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { QrCode } from "lucide-react";
import { merchant1, merchant2, merchant3, qr } from "../../../assets/assets";
import ComponentCard from "../../../components/common/ComponentCard";
import MerchantCard from "./components/MerchantCard";
import { useGetMerchantMutation } from "../../../redux/features/member/shopWithMerchant/shopWihtMerchantApi";

const ShopWithMerchant = () => {
  const navigate = useNavigate();
  const [getMerchant, { isLoading }] = useGetMerchantMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const code = data.merchantNameOrUniqueNumber?.trim();
      if (!code) {
        toast.error("Please enter a valid merchant unique number.");
        return;
      }

      const res = await getMerchant(code).unwrap();

      if (res?.id) {
        toast.success(`Merchant "${res.business_name}" found successfully!`);
        navigate("/member/redeem-with-merchant", { state: { merchant: res } });
      } else {
        toast.error("Merchant not found. Please check the code and try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.message || "Failed to retrieve merchant information."
      );
    }
  };

  const merchantInfo = [
    { name: "Starbucks", image: merchant1, distance: "1.2km away" },
    { name: "Dunkin'", image: merchant2, distance: "2.5km away" },
    { name: "Eleven", image: merchant3, distance: "3.1km away" },
    { name: "KKV", image: merchant2, distance: "4.0km away" },
  ];

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Shop With Merchants" }]}
      />

      {/* Search Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white pb-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800">Merchant</h3>
          <PrimaryButton variant="accent" size="md">
            Transaction
          </PrimaryButton>
        </div>

        {/* Form Section */}
        <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Left Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="max-w-[343px]">
              <Label htmlFor="merchant">Merchant Name / Unique Number</Label>
              <Input
                id="merchant"
                placeholder="Enter merchant unique number"
                {...register("merchantNameOrUniqueNumber", {
                  required: "Merchant unique number is required",
                })}
                error={!!errors.merchantNameOrUniqueNumber}
                hint={errors.merchantNameOrUniqueNumber?.message}
              />
            </div>

            <div className="mt-8">
              <PrimaryButton
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Redeem"}
              </PrimaryButton>
            </div>
          </form>

          {/* Divider */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-brand-200/40"></div>

          {/* Right Section */}
          <div className="flex flex-col justify-center items-center">
            <img
              src={qr}
              alt="QR Code"
              className="mb-6 w-28 h-28 object-contain"
            />
            <PrimaryButton variant="primary" size="md">
              <QrCode /> Search with QR Code
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Recent Merchants */}
      <ComponentCard title="Recent Registered Merchants" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {merchantInfo.map((merchant, index) => (
            <MerchantCard key={index} merchant={merchant} />
          ))}
        </div>
      </ComponentCard>
    </div>
  );
};

export default ShopWithMerchant;
