import React from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import DatePicker from "../../../components/form/DatePicker";
import Dropzone from "../../../components/form/form-elements/Dropzone";

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
          <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <Label htmlFor="date picker">Create Date</Label>
                <DatePicker />
              </div>
              <div>
                <Label htmlFor="merchantId">Merchant ID</Label>
                <Input
                  type="text"
                  id="merchantId"
                  placeholder="MAX-1010"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  type="text"
                  id="businessName"
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  id="businessType"
                  name="businessType"
                  placeholder="Business Type"
                  options={[
                    { value: "", label: "Retail" },
                    { value: "", label: "Service" },
                  ]}
                />
              </div>
              <div>
                <Label htmlFor="businessDescription">
                  Business Description
                </Label>
                <Input
                  type="text"
                  id="businessDescription"
                  placeholder="Enter Business Description"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Company Address</Label>
                <Input
                  type="text"
                  id="companyAddress"
                  placeholder="Enter member full name"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  placeholder="Status"
                  options={[
                    { value: "", label: "Block" },
                    { value: "", label: "Suspended" },
                    { value: "", label: "Active" },
                  ]}
                />
              </div>
              <div>
                <Label htmlFor="registrationNumber">
                  Registration Number / License No
                </Label>
                <Input
                  type="text"
                  id="registrationNumber"
                  placeholder="Registration Number / License No"
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="logo"> Upload Company Logo</Label>
              <Dropzone />
            </div>
          </div>
        </ComponentCard>

        <div className="mt-6">
          <ComponentCard title="Bank Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  type="text"
                  id="bankName"
                  placeholder="Enter Bank Name"
                />
              </div>
              <div>
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  type="text"
                  id="accountHolderName"
                  placeholder="Enter Account Holder Name"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number / IBAN</Label>
                <Input
                  type="text"
                  id="accountNumber"
                  placeholder="Enter Account Number / IBAN"
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Preferred Payment Method</Label>

                <Select
                  id="paymentMethod"
                  name="paymentMethod"
                  placeholder="Preferred Payment Method"
                  options={[
                    { value: "", label: "Online" },
                    { value: "", label: "Offline" },
                  ]}
                />
              </div>
              <div>
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  type="text"
                  id="routingNumber"
                  placeholder="Enter Routing Number"
                />
              </div>
              <div>
                <Label htmlFor="swiftCode">Swift Code</Label>
                <Input
                  type="text"
                  id="swiftCode"
                  placeholder="Enter Swift Code"
                />
              </div>
            </div>
          </ComponentCard>
        </div>
        <div className="mt-6">
          <ComponentCard title="Owner Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    type="text"
                    id="ownerName"
                    placeholder="Enter Owner Name"
                  />
                </div>
                <div>
                  <Label htmlFor="fullName">Phone Number</Label>
                  <Input
                    type="phoneNumber"
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
                      { value: "other", label: "Others" },
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

              <div className="">
                <Label htmlFor="logo"> Upload Owner ID</Label>
                <Dropzone />
              </div>
              <div className="">
                <Label htmlFor="logo"> Upload Tax Certificate</Label>
                <Dropzone />
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Referral */}
        <div className="mt-6">
          <ComponentCard title="Referral Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fullName">Referrer Name</Label>

                <Select
                  id="gender"
                  name="gender"
                  placeholder="Select Referrer Name"
                  options={[
                    { value: "male", label: "" },
                    { value: "female", label: "" },
                    { value: "other", label: "" },
                  ]}
                />
              </div>
              <div>
                <Label htmlFor="fullName">Referrer ID</Label>

                <Select
                  id="gender"
                  name="gender"
                  placeholder="Select Referrer ID"
                  options={[
                    { value: "male", label: "" },
                    { value: "female", label: "" },
                    { value: "other", label: "" },
                  ]}
                />
              </div>
              <div>
                <Label htmlFor="fullName">Referrer Status</Label>

                <Select
                  id="gender"
                  name="gender"
                  placeholder="Select Referrer Status"
                  options={[
                    { value: "male", label: "" },
                    { value: "female", label: "" },
                    { value: "other", label: "" },
                  ]}
                />
              </div>
            </div>
          </ComponentCard>
        </div>
        <div className="mt-6">
          <ComponentCard title="Platform Settings">
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 lg:gap-4">
              <div>
                <Label htmlFor="fullName">Commission Rate (%)</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter Commission Rate (%)"
                />
              </div>{" "}
              <div>
                <Label htmlFor="fullName">Settlement Period</Label>

                <Select
                  id="gender"
                  name="gender"
                  placeholder="Select Settlement Period"
                  options={[
                    { value: "male", label: "" },
                    { value: "female", label: "" },
                    { value: "other", label: "" },
                  ]}
                />
              </div>{" "}
              <div>
                <Label htmlFor="fullName">APProved By</Label>

                <Select
                  id="gender"
                  name="gender"
                  placeholder="Select "
                  options={[
                    { value: "male", label: "" },
                    { value: "female", label: "" },
                    { value: "other", label: "" },
                  ]}
                />
              </div>{" "}
              <div>
                <Label htmlFor="fullName">User Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>{" "}
              <div>
                <Label htmlFor="fullName">Password</Label>
                <Input type="text" id="fullName" placeholder="Enter Password" />
              </div>{" "}
              <div>
                <Label htmlFor="fullName">Confirm Password</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter Confirm Password"
                />
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
