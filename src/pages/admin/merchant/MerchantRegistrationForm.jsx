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
                <Label htmlFor="date picker">Date picker</Label>
                <DatePicker />
              </div>
              <div>
                <Label htmlFor="fullName">Merchant ID</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="MAX-1010"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>
              <div>
                <Label htmlFor="referralCode">Business Type</Label>
                <Select
                  id="referralCode"
                  name="referralCode"
                  placeholder="Referral Code"
                  options={[
                    { value: "", label: "Retail" },
                    { value: "", label: "Service" },
                  ]}
                />
              </div>
              <div>
                <Label htmlFor="fullName">Business Description</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Company Address</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>
              <div>
                <Label htmlFor="referralCode">Status</Label>
                <Select
                  id="referralCode"
                  name="referralCode"
                  placeholder="Referral Code"
                  options={[
                    { value: "", label: "" },
                    { value: "", label: "" },
                  ]}
                />
              </div>
              <div>
                <Label htmlFor="fullName">
                  Registration Number / License No
                </Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
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
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
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
                  <Label htmlFor="fullName">Business Name</Label>
                  <Input
                    type="text"
                    id="fullName"
                    placeholder="Enter member full name"
                  />
                </div>
                <div>
                  <Label htmlFor="fullName">Business Name</Label>
                  <Input
                    type="text"
                    id="fullName"
                    placeholder="Enter member full name"
                  />
                </div>
                <div>
                  <Label htmlFor="fullName">Business Name</Label>
                  <Input
                    type="text"
                    id="fullName"
                    placeholder="Enter member full name"
                  />
                </div>
                <div>
                  <Label htmlFor="fullName">Business Name</Label>
                  <Input
                    type="text"
                    id="fullName"
                    placeholder="Enter member full name"
                  />
                </div>
                <div>
                  <Label htmlFor="fullName">Business Name</Label>
                  <Input
                    type="text"
                    id="fullName"
                    placeholder="Enter member full name"
                  />
                </div>
              </div>

              <div className="">
                <Label htmlFor="logo"> Upload Company Logo</Label>
                <Dropzone />
              </div>
              <div className="">
                <Label htmlFor="logo"> Upload Company Logo</Label>
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
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>
            </div>
          </ComponentCard>
        </div>
        <div className="mt-6">
          <ComponentCard title="Platform Settings">
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 lg:gap-4">
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>{" "}
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>{" "}
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>{" "}
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>{" "}
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
                />
              </div>{" "}
              <div>
                <Label htmlFor="fullName">Business Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  placeholder="Enter member full name"
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
