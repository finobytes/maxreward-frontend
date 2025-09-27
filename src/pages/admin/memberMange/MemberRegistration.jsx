import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { EyeIcon, EyeOffIcon, TimerIcon } from "lucide-react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { useState } from "react";
import Dropzone from "../../../components/form/form-elements/Dropzone";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Select from "../../../components/form/Select";

const MemberRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [referralCode, setReferralCode] = useState("");

  // state for files
  const [profilePic, setProfilePic] = useState([]);
  const [passportFiles, setPassportFiles] = useState([]);

  const handleSubmit = () => {
    console.log("Profile Picture:", profilePic);
    console.log("Passport Files:", passportFiles);
  };
  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Member Manage", to: "/admin/member-manage" },
          { label: "Member Registration" },
        ]}
      />
      <ComponentCard title="Member Information">
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
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
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="Address">Full Address</Label>
            <Input type="text" id="Address" placeholder="Enter Full Address" />
          </div>
          <div>
            <Label htmlFor="City">City</Label>
            <Input type="text" id="City" placeholder="Enter City" />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter member full name"
            />
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="" />
                ) : (
                  <EyeOffIcon className="" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Dropzones */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
          <div>
            <Label>Profile Picture</Label>
            <Dropzone
              onFilesChange={setProfilePic}
              multiple={false}
              maxFiles={1}
            />
          </div>
          <div>
            <Label>National ID / Passport</Label>
            <Dropzone
              onFilesChange={setPassportFiles}
              multiple={true}
              maxFiles={2}
            />
          </div>
        </div>
      </ComponentCard>
      <div className="mt-8">
        <ComponentCard>
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
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
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="referredBy">Referred By</Label>
              <Input
                type="text"
                id="referredBy"
                placeholder=""
                disabled="true"
              />
            </div>
            <div>
              <Label htmlFor="Address">Referral Status</Label>
              <Input type="text" id="Address" placeholder="" disabled="true" />
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <PrimaryButton>Submit</PrimaryButton>
            <PrimaryButton variant="secondary">Back</PrimaryButton>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default MemberRegistration;
