import React, { useEffect } from "react";
import ProfileCard from "./components/ProfileCard";
import OwnerInfoCard from "./components/OwnerInfoCard";
import PasswordUpdate from "./components/PasswordUpdate";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { useSelector } from "react-redux";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import ProfileSkeleton from "../../../components/skeleton/ProfileSkeleton";
import { toast } from "sonner";

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const role = user?.role || "member"; // admin | merchant | member

  const { data, isLoading, error } = useVerifyMeQuery(role, { skip: !token });

  useEffect(() => {
    if (error) {
      const errorMessage =
        error?.data?.message || "Failed to load profile information.";
      toast.error(errorMessage);
    }
  }, [error]);

  if (isLoading) return <ProfileSkeleton />;
  return (
    <div className="">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Profile" }]}
      />
      <div className="max-w-[650px] space-y-4">
        <ProfileCard userInfo={data} />
        <OwnerInfoCard userInfo={data} />
        <PasswordUpdate />
      </div>
    </div>
  );
};

export default Profile;
