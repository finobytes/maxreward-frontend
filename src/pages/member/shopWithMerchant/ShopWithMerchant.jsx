import React from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import PrimaryButton from "./../../../components/ui/PrimaryButton";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { QrCode, ScanQrCode } from "lucide-react";
import { qr } from "../../../assets/assets";

const ShopWithMerchant = () => {
  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Shop With Merchants" }]}
      />
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white pb-4">
          <div className="max-w-full overflow-x-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800">Merchant</h3>
              <PrimaryButton variant="success" size="md">
                Transaction
              </PrimaryButton>
            </div>
            <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Left Section */}
              <form className="p-4">
                {/* Merchant */}
                <div className="max-w-[343px]">
                  <Label htmlFor="merchant">Select Merchant</Label>
                  <Select
                    id="merchant"
                    name="merchant"
                    placeholder="Select Merchant"
                    options={[
                      { value: "starbucks", label: "Starbucks" },
                      { value: "dunkin", label: "Dunkin'" },
                      { value: "eleven", label: "Eleven" },
                      { value: "kkv", label: "KKV" },
                    ]}
                  />
                </div>
                <div className="mt-8">
                  <PrimaryButton variant="primary" size="md">
                    Redeem
                  </PrimaryButton>
                </div>
              </form>

              {/* Vertical Divider (visible only on md and up) */}
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
        </div>
      </div>
    </div>
  );
};

export default ShopWithMerchant;
