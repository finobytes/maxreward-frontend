import React from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import PrimaryButton from "../../../components/ui/PrimaryButton";

const MerchantRegistrationForm = () => {
  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Merchant", to: "/admin/merchant/active-merchant" },
          { label: "Merchant Registration" },
        ]}
      />
      <form>
        <ComponentCard title="Member Information">
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 lg:gap-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">
                Full Name (<span className="text-red-500">*</span>)
              </Label>
              <Input
                type="text"
                id="fullName"
                placeholder="Enter member full name"
              />
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phoneNumber">
                Phone Number (<span className="text-red-500">*</span>)
              </Label>
              <Input
                type="text"
                id="phoneNumber"
                placeholder="Enter Phone Number"
              />
            </div>

            {/* Gender */}
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                name="gender"
                placeholder="Select Gender"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Full Address</Label>
              <Input
                type="text"
                id="address"
                placeholder="Enter Full Address"
              />
            </div>

            {/* City */}
            <div>
              <Label htmlFor="city">City</Label>
              <Input type="text" id="city" placeholder="Enter City" />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter Email Address"
              />
            </div>
          </div>
        </ComponentCard>

        {/* Referral */}
        <div className="mt-8">
          <ComponentCard>
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 lg:gap-4">
              <div>
                <Label htmlFor="referralCode">
                  Referral Code (<span className="text-red-500">*</span>)
                </Label>
                <Select
                  id="referralCode"
                  name="referralCode"
                  placeholder="Referral Code"
                  options={[
                    { value: "MAX-1001", label: "MAX-1001" },
                    { value: "MAX-1002", label: "MAX-1002" },
                    { value: "MAX-1003", label: "MAX-1003" },
                  ]}
                />
              </div>

              <div>
                <Label htmlFor="referredBy">Referred By</Label>
                <Input type="text" id="referredBy" disabled />
              </div>
              <div>
                <Label htmlFor="referralStatus">Referral Status</Label>
                <Input type="text" id="referralStatus" disabled />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <PrimaryButton type="submit">Submit</PrimaryButton>
              <PrimaryButton variant="secondary" type="button">
                Back
              </PrimaryButton>
            </div>
          </ComponentCard>
        </div>
      </form>
    </div>
  );
};

export default MerchantRegistrationForm;
