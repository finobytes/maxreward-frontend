import React, { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import PrimaryButton from "./../../../components/ui/PrimaryButton";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { ArrowRight, QrCode, ScanQrCode } from "lucide-react";
import { merchant1, merchant2, merchant3 } from "../../../assets/assets";
import ComponentCard from "./../../../components/common/ComponentCard";
import MerchantCard from "./components/MerchantCard";
import Input from "../../../components/form/input/InputField";

const RedeemWithMerchant = () => {
  const [verified, setVerified] = useState(false);
  const merchantInfo = [
    { name: "Starbucks", image: merchant1, distance: "1.2km away" },
    { name: "Dunkin'", image: merchant2, distance: "2.5km away" },
    { name: "Eleven", image: merchant2, distance: "3.1km away" },
    { name: "KKV", image: merchant3, distance: "4.0km away" },
  ];
  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Shop With Merchants", to: "/member/shop-with-merchant" },
          { label: "Redeem With Registered Merchants" },
        ]}
      />
      <ComponentCard title="Recent Registered Merchants" className="mt-6">
        <div className="w-full block md:flex justify-center items-start gap-8">
          <div className="w-full">
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img
                src={merchantInfo[3].image}
                alt={merchantInfo[0].name}
                className="w-full h-full object-cover rounded-lg mb-4"
              />
              <h4 className="text-2xl lg:text-3xl font-semibold text-gray-800">
                {merchantInfo[0].name}
              </h4>
            </div>
          </div>
          <div className="w-full">
            <form className="max-w-[343px]">
              {verified ? (
                <>
                  <div>
                    <Label htmlFor="merchant-name">Merchant Name</Label>
                    <Input
                      id="merchant-name"
                      value={merchantInfo[0].name}
                      disabled
                    />
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="transaction-amount">
                      Transaction Amount
                    </Label>
                    <Input
                      id="transaction-amount"
                      type="number"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="redeem-amount">Redeem Amount</Label>
                    <Input
                      id="redeem-amount"
                      type="number"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="balance-to-pay">Balance to Pay</Label>
                    <Input id="balance-to-pay" value="RM 50.00" disabled />
                  </div>

                  <div className="mt-6">
                    <PrimaryButton variant="accent" size="md">
                      <span className="flex items-center gap-2">5,000</span>
                      <span className="flex items-center gap-2">
                        Send Redeem Request <ArrowRight />
                      </span>
                    </PrimaryButton>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="merchant-name">Merchant Name</Label>
                    <Input
                      id="merchant-name"
                      value={merchantInfo[0].name}
                      disabled
                    />
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="transaction-amount">
                      Transaction Amount
                    </Label>
                    <Input
                      id="transaction-amount"
                      type="number"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="redeem-amount">Redeem Amount</Label>
                    <Input
                      id="redeem-amount"
                      type="number"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="mt-8">
                    <PrimaryButton
                      variant="primary"
                      size="md"
                      onClick={() => setVerified(true)}
                    >
                      Verify Purchase
                    </PrimaryButton>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default RedeemWithMerchant;
