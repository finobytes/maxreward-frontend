import React from "react";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import ComponentCard from "../../../../components/common/ComponentCard";
import { useLogoutMutation } from "../../../../redux/features/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { baseApi } from "../../../../redux/api/baseApi";
import { logout } from "../../../../redux/features/auth/authSlice";
import { toast } from "sonner";

const OwnerInfoCard = ({ userInfo }) => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "member"; // admin | merchant | member
  const [logoutApi, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // call backend logout endpoint
      const res = await logoutApi(role).unwrap();
      dispatch(baseApi.util.resetApiState());
      // clear local Redux state & localStorage
      dispatch(logout());
      toast.success(res?.message || "Logged out successfully ");
      // redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed ");
      dispatch(baseApi.util.resetApiState());
      dispatch(logout());
      navigate("/login");
    }
  };
  const people = [
    {
      key: "Name:",
      value: userInfo?.name || "N/A",
    },
    {
      key: "Email:",
      value: userInfo?.email || "N/A",
    },
    {
      key: "Phone:",
      value: userInfo?.phone || "N/A",
    },
    {
      key: "Address:",
      value: userInfo?.address || "N/A",
    },
    {
      key: "Create at:",
      value: `${new Date(userInfo?.created_at).toLocaleDateString()}` || "N/A",
    },
  ];
  return (
    <div className="">
      {/* Info List */}
      <ComponentCard title="Personal Information">
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative min-w-full divide-y divide-gray-200">
                <ul className="divide-y divide-gray-200">
                  {people.map((person) => (
                    <li className="flex" key={person.email}>
                      <p className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                        {person.key}
                      </p>
                      <p className="py-4 text-sm whitespace-nowrap text-gray-900">
                        {person.value}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="py-4">
          {userInfo?.member_type === "general" ? (
            <PrimaryButton
              type="button"
              variant="primary"
              size="md"
              to="/member/merchant-application"
            >
              Apply For Merchant
            </PrimaryButton>
          ) : (
            <PrimaryButton
              type="button"
              variant="primary"
              size="md"
              onClick={handleLogout}
              disabled={isLoading}
            >
              Login To Merchant
            </PrimaryButton>
          )}
        </div>
      </ComponentCard>
    </div>
  );
};

export default OwnerInfoCard;
