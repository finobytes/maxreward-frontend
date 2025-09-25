import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { EyeIcon, EyeOffIcon, TimerIcon } from "lucide-react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { useState } from "react";
import Dropzone from "../../../components/form/form-elements/Dropzone";

const MemberRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  // state for files
  const [profilePic, setProfilePic] = useState([]);
  const [passportFiles, setPassportFiles] = useState([]);

  const handleSubmit = () => {
    console.log("Profile Picture:", profilePic);
    console.log("Passport Files:", passportFiles);
    // এখানে backend এ পাঠানোর জন্য formData বানাতে পারবে
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
    </div>
  );
};

export default MemberRegistration;
