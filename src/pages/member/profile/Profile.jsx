import React, { useEffect, useState } from "react";
import ProfileCard from "./components/ProfileCard";
import OwnerInfoCard from "./components/OwnerInfoCard";
import PasswordUpdate from "./components/PasswordUpdate";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { useSelector } from "react-redux";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import ProfileSkeleton from "../../../components/skeleton/ProfileSkeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { profilePlaceholder } from "../../../assets/assets";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { useUpdateMemberProfileMutation } from "../../../redux/features/member/profile/profileUpdateApi";

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const role = user?.role || "member"; // admin | merchant | member

  const { data, isLoading, error, refetch } = useVerifyMeQuery(role, {
    skip: !token,
  });
  const [updateMemberProfile, { isLoading: isUpdating }] =
    useUpdateMemberProfileMutation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormValues, setEditFormValues] = useState({
    name: "",
    email: "",
    address: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(profilePlaceholder);
  const [localAvatarUrl, setLocalAvatarUrl] = useState(null);

  useEffect(() => {
    if (error) {
      const errorMessage =
        error?.data?.message || "Failed to load profile information.";
      toast.error(errorMessage);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    setEditFormValues({
      name: data?.name ?? "",
      email: data?.email ?? "",
      address: data?.address ?? "",
      avatar: null,
    });
    setAvatarPreview(
      data?.profile_image || data?.avatar || data?.photo || profilePlaceholder
    );
    setLocalAvatarUrl(null);
  }, [data]);

  useEffect(
    () => () => {
      if (localAvatarUrl) {
        URL.revokeObjectURL(localAvatarUrl);
      }
    },
    [localAvatarUrl]
  );

  const handleEditButtonClick = () => {
    setIsEditDialogOpen(true);
  };

  const resetEditForm = () => {
    if (!data) {
      setEditFormValues({
        name: "",
        email: "",
        address: "",
        avatar: null,
      });
      setAvatarPreview(profilePlaceholder);
      setLocalAvatarUrl(null);
      return;
    }
    setEditFormValues({
      name: data?.name ?? "",
      email: data?.email ?? "",
      address: data?.address ?? "",
      avatar: null,
    });
    setAvatarPreview(
      data?.profile_image || data?.avatar || data?.photo || profilePlaceholder
    );
    setLocalAvatarUrl(null);
  };

  const handleDialogOpenChange = (open) => {
    setIsEditDialogOpen(open);
    if (!open) resetEditForm();
  };

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setEditFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setLocalAvatarUrl(blobUrl);
    setAvatarPreview(blobUrl);
    setEditFormValues((prev) => ({ ...prev, avatar: file }));
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", editFormValues.name ?? "");
    formData.append("email", editFormValues.email ?? "");
    formData.append("address", editFormValues.address ?? "");
    if (editFormValues.avatar) {
      formData.append("image", editFormValues.avatar);
    }

    try {
      const response = await updateMemberProfile(formData).unwrap();
      toast.success(
        response?.message || "Profile information updated successfully."
      );
      await refetch();
      handleDialogOpenChange(false);
    } catch (updateError) {
      console.error("Failed to update profile:", updateError);
      const errorMessage =
        updateError?.data?.message ||
        "Failed to update profile information. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  return (
    <div className="">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Profile" }]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProfileCard userInfo={data} onEditClick={handleEditButtonClick} />
        <OwnerInfoCard userInfo={data} />
        <PasswordUpdate />
      </div>
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={handleDialogOpenChange}
        formValues={editFormValues}
        avatarPreview={avatarPreview}
        onInputChange={handleFormInputChange}
        onAvatarChange={handleAvatarChange}
        onSubmit={handleEditFormSubmit}
        isSubmitting={isUpdating}
      />
    </div>
  );
};

const EditProfileDialog = ({
  open,
  onOpenChange,
  formValues,
  avatarPreview,
  onInputChange,
  onAvatarChange,
  onSubmit,
  isSubmitting = false,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Edit member profile</DialogTitle>
        <DialogDescription>
          Update your personal information to keep your profile current.
        </DialogDescription>
      </DialogHeader>
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="flex items-center gap-4">
          <img
            src={avatarPreview}
            alt="Member avatar"
            className="h-20 w-20 rounded-full border border-gray-200 object-cover shadow-sm"
          />
          <div className="flex-1 space-y-2">
            <Label htmlFor="profile-picture">Profile picture</Label>
            <Input
              id="profile-picture"
              type="file"
              accept="image/*"
              onChange={onAvatarChange}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">JPG, PNG or WebP up to 5MB.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="member-name">Full name</Label>
            <Input
              id="member-name"
              name="name"
              placeholder="John Doe"
              value={formValues.name}
              onChange={onInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-email">Email</Label>
            <Input
              id="member-email"
              name="email"
              type="email"
              placeholder="john@email.com"
              value={formValues.email}
              onChange={onInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-address">Address</Label>
            <textarea
              id="member-address"
              name="address"
              rows={4}
              className="h-28 w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20"
              placeholder="Street, City, Country"
              value={formValues.address}
              onChange={onInputChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <PrimaryButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton size="sm" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </PrimaryButton>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

export default Profile;
