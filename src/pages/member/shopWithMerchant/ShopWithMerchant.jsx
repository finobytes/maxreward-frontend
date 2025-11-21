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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const ShopWithMerchant = () => {
  const navigate = useNavigate();
  const [getMerchant, { isLoading }] = useGetMerchantMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitSimple = async (data) => {
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

  const onSubmitAdvanced = async (data) => {
    toast.info("Advanced search filter applied!", data);
    // Implement your advanced filter search API here
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
        items={[{ label: "Home", to: "/" }, { label: "Shop At Merchants" }]}
      />

      {/* Search Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white pb-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800">Merchant</h3>
          <PrimaryButton
            variant="accent"
            size="md"
            to="/member/redeem-transactions"
          >
            Transaction
          </PrimaryButton>
        </div>

        {/* Form Section */}
        <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Left Section */}
          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="simple">Name / Unique Number</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
            </TabsList>

            {/* SIMPLE SEARCH */}
            <TabsContent value="simple">
              <form
                onSubmit={handleSubmit(onSubmitSimple)}
                className="space-y-4"
              >
                <div className="max-w-[350px]">
                  <Label>Merchant Name / Unique Number</Label>
                  <Input
                    placeholder="Enter merchant unique number or Name"
                    {...register("simpleCode", {
                      required: "Merchant code is required",
                    })}
                  />
                  {errors.simpleCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.simpleCode.message}
                    </p>
                  )}
                </div>

                <Button
                  className="bg-brand-200 hover:bg-brand-200"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Redeem"}
                </Button>
              </form>
            </TabsContent>

            {/* ADVANCED SEARCH */}
            <TabsContent value="advanced">
              <form
                onSubmit={handleSubmit(onSubmitAdvanced)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* STATE */}
                <div>
                  <Label>State</Label>
                  <Input placeholder="Enter state" {...register("state")} />
                </div>

                {/* TOWN */}
                <div>
                  <Label>Town</Label>
                  <Input placeholder="Enter town" {...register("town")} />
                </div>

                {/* AREA */}
                <div>
                  <Label>Area</Label>
                  <Input placeholder="Enter area" {...register("area")} />
                </div>

                {/* PRODUCT / SERVICE */}
                <div>
                  <Label>Product / Service</Label>
                  <Select onValueChange={(v) => (data.productService = v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product/service" />
                    </SelectTrigger>
                    <SelectContent>
                      {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                        <SelectItem key={letter} value={letter}>
                          {letter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <p className="text-xs text-gray-500 mt-1">
                    Filters merchants whose product/service starts with this
                    letter.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="col-span-full mt-2">
                  <Button
                    className="bg-brand-200 hover:bg-brand-200"
                    type="submit"
                  >
                    Redeem
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

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
      {/* <ComponentCard title="Recent Registered Merchants" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {merchantInfo.map((merchant, index) => (
            <MerchantCard key={index} merchant={merchant} />
          ))}
        </div>
      </ComponentCard> */}
    </div>
  );
};

export default ShopWithMerchant;
