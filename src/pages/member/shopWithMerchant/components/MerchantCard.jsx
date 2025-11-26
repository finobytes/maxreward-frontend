import React from "react";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import { MapPin } from "lucide-react";

const MerchantCard = ({ merchant }) => {
  console.log(merchant);
  return (
    <div>
      <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <img
          src={merchant?.business_logo}
          alt={merchant?.business_name}
          className="w-full h-auto object-cover rounded-lg mb-4"
        />
        <p className="flex items-center mb-2">
          <MapPin size={24} className="text-brand-25 mr-2" />{" "}
          {merchant?.address}
        </p>
        <h4 className="text-2xl lg:text-3xl font-semibold text-gray-800">
          {merchant?.business_name}
        </h4>
        <div className="mt-8">
          <PrimaryButton
            variant="primary"
            size="md"
            to={"/member/redeem-with-merchant"}
            state={{ merchant: merchant }}
          >
            Redeem
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default MerchantCard;
