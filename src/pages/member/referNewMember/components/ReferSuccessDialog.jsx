import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import PrimaryButton from "../../../../components/ui/PrimaryButton";

const ReferSuccessDialog = ({ open, onClose, response }) => {
  if (!response?.success) return null;

  const { new_member, credentials, referrer } = response.data || {};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-6 h-6" />
            <DialogTitle>Referral Successful!</DialogTitle>
          </div>
          <DialogDescription>
            {response?.message ||
              "New member has been registered successfully."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4 text-sm">
          <div className="rounded-lg border p-3 bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-1">New Member Info</h3>
            <p>
              <strong>Name:</strong> {new_member?.name}
            </p>
            <p>
              <strong>Phone:</strong> {new_member?.phone}
            </p>
            <p>
              <strong>Username:</strong> {new_member?.user_name}
            </p>
            <p>
              <strong>Referral Code:</strong> {new_member?.referral_code}
            </p>
          </div>

          <div className="rounded-lg border p-3 bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-1">
              Login Credentials
            </h3>
            <p>
              <strong>Username:</strong> {credentials?.user_name}
            </p>
            <p>
              <strong>Password:</strong> {credentials?.password}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ({credentials?.message})
            </p>
          </div>

          <div className="rounded-lg border p-3 bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-1">Referrer Info</h3>
            <p>
              <strong>Name:</strong> {referrer?.name}
            </p>
            <p>
              <strong>Total Referrals:</strong> {referrer?.total_referrals}
            </p>
            <p>
              <strong>Remaining RP Balance:</strong>{" "}
              {referrer?.remaining_rp_balance}
            </p>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <PrimaryButton onClick={onClose} variant="secondary" size="md">
            Close
          </PrimaryButton>
          <PrimaryButton
            to="/member/referred-member-list"
            variant="primary"
            size="md"
          >
            Go To Referred Member List
          </PrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReferSuccessDialog;
