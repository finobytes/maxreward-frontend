import React from "react";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import Input from "../../../../components/form/input/InputField";

const PasswordUpdate = () => {
  return (
    <div>
      <ComponentCard title="Password">
        <form className="space-y-4">
          <div>
            <Label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </Label>
            <Input
              type="password"
              id="current-password"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <Label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </Label>
            <Input
              type="password"
              id="new-password"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <Label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </Label>
            <Input
              type="password"
              id="confirm-password"
              placeholder="Confirm new password"
            />
          </div>
          <PrimaryButton type="submit" variant="primary" size="md">
            Update Password
          </PrimaryButton>
        </form>
      </ComponentCard>
    </div>
  );
};

export default PasswordUpdate;
